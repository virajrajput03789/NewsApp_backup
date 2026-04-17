import React, { useCallback } from 'react';
import { FlatList, StyleSheet, ListRenderItemInfo, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAllBookmarks } from '../store/selectors';
import ArticleCard from '../components/ArticleCard';
import EmptyState from '../components/EmptyState';
import { Article } from '../types/article';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, HomeStackParamList } from '../types/navigation';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { store } from '../store';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'BookmarksTab'>,
  NativeStackScreenProps<HomeStackParamList>
>;

const ITEM_HEIGHT = 120;

const BookmarksScreen: React.FC<Props> = ({ navigation }) => {
  const bookmarks = useSelector(selectAllBookmarks);

  const handlePressArticle = useCallback((url: string) => {
    const state = store.getState();
    const article = state.bookmarks.items.find(a => a.url === url);
    if (article) {
      navigation.navigate('HomeTab', {
        screen: 'Detail',
        params: { article },
      });
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

  const keyExtractor = useCallback((item: Article) => `bookmark-${item.url}`, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={<EmptyState message="No bookmarked articles yet." />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookmarksScreen;