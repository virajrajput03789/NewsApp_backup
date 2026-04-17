import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types/article';

interface BookmarksState {
  items: Article[];
  hydrated: boolean;
}

const initialState: BookmarksState = {
  items: [],
  hydrated: false,
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Article[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    add(state, action: PayloadAction<Article>) {
      if (!state.items.find((a) => a.url === action.payload.url)) {
        state.items.push(action.payload);
      }
    },
    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter((a) => a.url !== action.payload);
    },
  },
});

export const { hydrate, add, remove } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;