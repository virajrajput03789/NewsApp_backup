import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add, remove } from '../store/bookmarksSlice';
import { selectIsBookmarked } from '../store/selectors';
import { Article } from '../types/article';
import { RootState } from '../store';
import { useToast } from './useToast';

export const useBookmark = (article: Article) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isBookmarked = useSelector((state: RootState) => selectIsBookmarked(state, article.url));

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      dispatch(remove(article.url));
      showToast('Article removed from bookmarks');
    } else {
      dispatch(add(article));
      showToast('Article saved to bookmarks');
    }
  }, [dispatch, isBookmarked, article, showToast]);

  return { isBookmarked, toggleBookmark };
};