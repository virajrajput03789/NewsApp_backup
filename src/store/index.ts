import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './articlesSlice';
import bookmarksReducer from './bookmarksSlice';
import searchReducer from './searchSlice';
import { persistMiddleware } from './middleware/persistMiddleware';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    bookmarks: bookmarksReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;