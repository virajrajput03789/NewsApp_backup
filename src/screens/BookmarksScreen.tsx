import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { useSelector } from 'react-redux';
import { selectBookmarks } from '../store/selectors';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { Article } from '../types/article';
import { TabParamList } from '../types/navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<TabParamList, 'BookmarksTab'>;

const BookmarksScreen: React.FC<Props> = ({ navigation }) => {
  const bookmarks = useSelector(selectBookmarks);

  const handlePressArticle = useCallback((url: string) => {
    const article = bookmarks.find(a => a.url === url);
    if (article) {
      // @ts-ignore - Detail exists in HomeStack but we're in a different tab
      // However, navigation.navigate works across tabs if the name is global
      navigation.navigate('HomeTab', {
        screen: 'Detail',
        params: { article }
      });
    }
  }, [bookmarks, navigation]);

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

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={(item) => item.url}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState message="You haven't saved any articles yet." />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 8,
  },
});

export default BookmarksScreen;