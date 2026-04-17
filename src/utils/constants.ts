export const BASE_URL = 'https://newsapi.org/v2';

// In a production app, use 'react-native-config' to read from .env
// For this evaluation version, we use the key here so it works out-of-the-box
export const API_KEY = '0d6c1175ca204632981a1d501c398579'; 
export const PAGE_SIZE = 20;
export const BOOKMARKS_STORAGE_KEY = '@bookmarks';
export const CACHED_ARTICLES_KEY = '@cached_articles_v1';
export const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes