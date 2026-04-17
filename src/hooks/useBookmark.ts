import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { add, remove } from '../store/bookmarksSlice';
import { selectIsBookmarked } from '../store/selectors';
import { Article } from '../types/article';
import { RootState } from '../store';

export const useBookmark = (article: Article) => {
  const dispatch = useDispatch();
  const isBookmarked = useSelector((state: RootState) => selectIsBookmarked(state, article.url));

  const toggleBookmark = useCallback(() => {
    if (isBookmarked) {
      dispatch(remove(article.url));
    } else {
      dispatch(add(article));
    }
  }, [dispatch, isBookmarked, article]);

  return { isBookmarked, toggleBookmark };
};