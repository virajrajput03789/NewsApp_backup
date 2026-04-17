import { Article } from '../types/article';
import { BASE_URL, PAGE_SIZE } from '../utils/constants';

export const fetchTopHeadlines = async (page: number, query: string = ''): Promise<Article[]> => {
  try {
    const params = new URLSearchParams({
      _page: page.toString(),
      _limit: PAGE_SIZE.toString(),
    });
    
    if (query) {
      params.append('q', query);
    }

    const response = await fetch(`${BASE_URL}/posts?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    return data.map((post: any) => ({
      source: { id: 'fallback', name: 'JSONPlaceholder' },
      author: 'Fallback Author',
      title: post.title,
      description: post.body,
      url: `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      urlToImage: null,
      publishedAt: new Date().toISOString(),
      content: post.body,
    }));
  } catch (error) {
    console.error('News API Error:', error);
    throw error;
  }
};