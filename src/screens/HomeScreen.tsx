import React, { useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ListRenderItemInfo, RefreshControl, Text, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchArticlesThunk, resetArticles } from '../store/articlesSlice';
import { setSearchQuery } from '../store/searchSlice';
import { selectAllArticles, selectArticlesStatus, selectSearchQuery } from '../store/selectors';
import { useDebounce } from '../hooks/useDebounce';
import { useAppState } from '../hooks/useAppState';
import { REFRESH_THRESHOLD_MS } from '../utils/constants';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import LoadingFooter from '../components/LoadingFooter';
import EmptyState from '../components/EmptyState';
import ErrorView from '../components/ErrorView';
import SkeletonCard from '../components/SkeletonCard';
import { Article } from '../types/article';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { store } from '../store';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const ITEM_HEIGHT = 136; // 120 (card) + 16 (spacing)

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const articles = useSelector(selectAllArticles);
  const status = useSelector(selectArticlesStatus);
  const error = useSelector((state: RootState) => state.articles.error);
  const page = useSelector((state: RootState) => state.articles.page);
  const hasMore = useSelector((state: RootState) => state.articles.hasMore);
  const lastFetched = useSelector((state: RootState) => state.articles.lastFetched);
  
  const rawSearchQuery = useSelector(selectSearchQuery);
  const debouncedQuery = useDebounce(rawSearchQuery, 300);

  const fetchNews = useCallback((p: number, q: string, isRefresh: boolean = false) => {
    dispatch(fetchArticlesThunk({ page: p, query: q, isRefresh }));
  }, [dispatch]);

  const onForeground = useCallback(() => {
    if (lastFetched && Date.now() - lastFetched > REFRESH_THRESHOLD_MS) {
      fetchNews(1, debouncedQuery, true);
    }
  }, [lastFetched, debouncedQuery, fetchNews]);
  
  useAppState(onForeground);

  useEffect(() => {
    dispatch(resetArticles());
    fetchNews(1, debouncedQuery);
  }, [debouncedQuery, dispatch, fetchNews]);

  const handleSearchChange = useCallback((text: string) => {
    dispatch(setSearchQuery(text));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (status !== 'loading' && hasMore) {
      fetchNews(page + 1, debouncedQuery);
    }
  }, [status, hasMore, page, debouncedQuery, fetchNews]);

  const handleRefresh = useCallback(() => {
    fetchNews(1, debouncedQuery, true);
  }, [debouncedQuery, fetchNews]);

  const handlePressArticle = useCallback((url: string) => {
    const state = store.getState();
    const article = state.articles.items.find(a => a.url === url) || state.bookmarks.items.find(a => a.url === url);
    if (article) {
      navigation.navigate('Detail', { article });
    }
  }, [navigation]);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<Article>) => {
    return (
      <ArticleCard
        url={item.url}
        title={item.title}
        sourceName={item.source.name}
        publishedAt={item.publishedAt}
        imageUrl={item.urlToImage}
        onPress={handlePressArticle}
        index={index % 10} // Loop for continuous scrolling
      />
    );
  }, [handlePressArticle]);

  if (status === 'failed' && articles.length === 0) {
    return <ErrorView message={error || 'Failed to load news'} onRetry={handleRefresh} />;
  }

  const isRefreshing = status === 'loading' && articles.length > 0 && page === 1;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.dateLabel}>{today}</Text>
            <Text style={styles.headerTitle}>Discovery</Text>
          </View>
          <View style={styles.profilePlaceholder}>
            <View style={styles.profileOnline} />
            <Text style={styles.profileText}>R</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={rawSearchQuery} onChangeText={handleSearchChange} />
      </View>

      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.url}-${index}`}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingFooter isLoading={status === 'loading' && page > 1} />}
        ListEmptyComponent={
          status === 'loading' && page === 1 ? (
            <View>{[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}</View>
          ) : (
            <EmptyState message="No articles found for your search." />
          )
        }
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh} 
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    ...TYPOGRAPHY.caption,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
    marginBottom: 0,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '800',
  },
  profilePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  profileOnline: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.surface,
    zIndex: 1,
  },
  profileText: {
    fontWeight: '800',
    color: COLORS.primary,
    fontSize: 16,
  },
  searchWrapper: {
    backgroundColor: COLORS.surface,
    paddingBottom: SPACING.sm,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: { elevation: 2 },
    }),
  },
  listContent: {
    paddingVertical: SPACING.md,
    paddingBottom: 40,
  },
});

export default HomeScreen;