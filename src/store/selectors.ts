import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';

export const selectArticlesState = (state: RootState) => state.articles;
export const selectBookmarksState = (state: RootState) => state.bookmarks;
export const selectSearchState = (state: RootState) => state.search;

export const selectAllArticles = createSelector(
  [selectArticlesState],
  (articles) => articles.items
);

export const selectArticlesStatus = createSelector(
  [selectArticlesState],
  (articles) => articles.status
);

export const selectAllBookmarks = createSelector(
  [selectBookmarksState],
  (bookmarks) => bookmarks.items
);

export const selectSearchQuery = createSelector(
  [selectSearchState],
  (search) => search.query
);

export const selectIsBookmarked = createSelector(
  [selectAllBookmarks, (_state: RootState, url: string) => url],
  (bookmarks, url) => bookmarks.some((b) => b.url === url)
);