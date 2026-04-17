import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { saveBookmarks } from '../../utils/storage';
import { add, remove } from '../bookmarksSlice';

export const persistMiddleware: Middleware<{}, RootState> = (storeAPI) => (next) => (action: any) => {
  const result = next(action);

  if (action.type === add.type || action.type === remove.type) {
    const state = storeAPI.getState();
    saveBookmarks(state.bookmarks.items);
  }

  return result;
};