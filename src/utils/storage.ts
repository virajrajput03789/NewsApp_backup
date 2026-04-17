import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../types/article';
import { BOOKMARKS_STORAGE_KEY, CACHED_ARTICLES_KEY } from './constants';

export const loadBookmarks = async (): Promise<Article[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load bookmarks', e);
    return [];
  }
};

export const saveBookmarks = async (articles: Article[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(articles);
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }
};

export const loadCachedArticles = async (): Promise<Article[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(CACHED_ARTICLES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load cached articles', e);
    return [];
  }
};

export const saveCachedArticles = async (articles: Article[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(articles);
    await AsyncStorage.setItem(CACHED_ARTICLES_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save cached articles', e);
  }
};