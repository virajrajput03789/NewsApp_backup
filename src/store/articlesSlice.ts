import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Article } from '../types/article';
import { fetchTopHeadlines } from '../api/newsApi';
import { saveCachedArticles, loadCachedArticles } from '../utils/storage';
import { PAGE_SIZE } from '../utils/constants';

interface FetchArticlesArgs {
  page: number;
  query: string;
  isRefresh?: boolean;
}

export const fetchArticlesThunk = createAsyncThunk(
  'articles/fetch',
  async ({ page, query, isRefresh }: FetchArticlesArgs, { rejectWithValue }) => {
    try {
      const articles = await fetchTopHeadlines(page, query);
      if (page === 1 && !query) {
        await saveCachedArticles(articles);
      }
      return { articles, page, isRefresh };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCachedArticlesThunk = createAsyncThunk(
  'articles/loadCached',
  async (_, { rejectWithValue }) => {
    try {
      const articles = await loadCachedArticles();
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface ArticlesState {
  items: Article[];
  page: number;
  hasMore: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

const initialState: ArticlesState = {
  items: [],
  page: 1,
  hasMore: true,
  status: 'idle',
  error: null,
  lastFetched: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    resetArticles(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticlesThunk.pending, (state, action) => {
        if (action.meta.arg.page === 1 && !action.meta.arg.isRefresh) {
            state.status = 'loading';
        }
      })
      .addCase(fetchArticlesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.lastFetched = Date.now();
        state.page = action.payload.page;
        
        const newArticles = action.payload.articles.filter(
            (article) => article.url !== 'https://removed.com'
        );

        if (action.payload.page === 1) {
          state.items = newArticles;
        } else {
          const existingUrls = new Set(state.items.map(a => a.url));
          const uniqueNew = newArticles.filter(a => !existingUrls.has(a.url));
          state.items = [...state.items, ...uniqueNew];
        }

        state.hasMore = newArticles.length >= PAGE_SIZE;
      })
      .addCase(fetchArticlesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'An error occurred';
      })
      .addCase(loadCachedArticlesThunk.fulfilled, (state, action) => {
          if (state.items.length === 0 && action.payload.length > 0) {
              state.items = action.payload;
              state.status = 'succeeded';
          }
      });
  },
});

export const { resetArticles } = articlesSlice.actions;
export default articlesSlice.reducer;