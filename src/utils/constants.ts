export const BASE_URL = 'https://newsapi.org/v2';

/** 
 * SECURITY NOTE: 
 * In production, use 'react-native-config' to read this from the .env file.
 * Example: 
 * import Config from 'react-native-config';
 * export const API_KEY = Config.API_KEY;
 */
export const API_KEY = ''; // Please add your key in .env and use a config library to bridge it
export const PAGE_SIZE = 20;
export const BOOKMARKS_STORAGE_KEY = '@bookmarks';
export const CACHED_ARTICLES_KEY = '@cached_articles_v1';
export const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes