import React, { useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ListRenderItemInfo, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchArticlesThunk, resetArticles } from '../store/articlesSlice';
import { setSearchQuery } from '../store/searchSlice';
import { selectAllArticles, selectArticlesStatus, selectSearchQuery } from '../store/selectors';
import { useDebounce } from '../hooks/useDebounce';
import { useAppState } from '../hooks/useAppState';
import { REFRESH_THRESHOLD_MS } from '../utils/constants';

import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import LoadingFooter from '../components/LoadingFooter';
import EmptyState from '../components/EmptyState';
import ErrorView from '../components/ErrorView';
import { Article } from '../types/article';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { store } from '../store';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const ITEM_HEIGHT = 120;

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

  const onForeground = useCallback(() => {
    if (lastFetched && Date.now() - lastFetched > REFRESH_THRESHOLD_MS) {
      dispatch(fetchArticlesThunk({ page: 1, query: debouncedQuery, isRefresh: true }));
    }
  }, [lastFetched, debouncedQuery, dispatch]);
  
  useAppState(onForeground);

  useEffect(() => {
    dispatch(resetArticles());
    dispatch(fetchArticlesThunk({ page: 1, query: debouncedQuery }));
  }, [debouncedQuery, dispatch]);

  const handleSearchChange = useCallback((text: string) => {
    dispatch(setSearchQuery(text));
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (status !== 'loading' && hasMore) {
      dispatch(fetchArticlesThunk({ page: page + 1, query: debouncedQuery }));
    }
  }, [status, hasMore, page, debouncedQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchArticlesThunk({ page: 1, query: debouncedQuery, isRefresh: true }));
  }, [debouncedQuery, dispatch]);

  const handlePressArticle = useCallback((url: string) => {
    const state = store.getState();
    const article = state.articles.items.find(a => a.url === url) || state.bookmarks.items.find(a => a.url === url);
    if (article) {
      navigation.navigate('Detail', { article });
    }
  }, [navigation]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Article>) => {
    return (
      <ArticleCard
        url={item.url}
        title={item.title}
        sourceName={item.source.name}
        publishedAt={item.publishedAt}
        imageUrl={item.urlToImage}
        onPress={handlePressArticle}
      />
    );
  }, [handlePressArticle]);

  const keyExtractor = useCallback((item: Article, index: number) => `${item.url}-${index}`, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  if (status === 'failed' && articles.length === 0) {
    return <ErrorView message={error || 'Failed to load news'} onRetry={handleRefresh} />;
  }

  const isRefreshing = status === 'loading' && articles.length > 0 && page === 1;

  return (
    <View style={styles.container}>
      <SearchBar value={rawSearchQuery} onChangeText={handleSearchChange} />
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingFooter isLoading={status === 'loading' && page > 1} />}
        ListEmptyComponent={
          status === 'loading' && page === 1 ? null : (
            <EmptyState message="No articles found." />
          )
        }
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#0066cc" />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;