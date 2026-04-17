import { Article } from '../types/article';
import { BASE_URL, PAGE_SIZE, API_KEY } from '../utils/constants';

export const fetchTopHeadlines = async (page: number, query: string = ''): Promise<Article[]> => {
  if (!API_KEY) {
    throw new Error('API_KEY is missing. Please add your key in src/utils/constants.ts or configure .env');
  }
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: PAGE_SIZE.toString(),
      apiKey: API_KEY,
    });
    
    let endpoint = '/top-headlines';
    if (query) {
      endpoint = '/everything';
      params.append('q', query);
    } else {
      params.append('country', 'us');
    }

    const response = await fetch(`${BASE_URL}${endpoint}?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch news');
    }

    return data.articles || [];
  } catch (error) {
    console.error('News API Error:', error);
    throw error;
  }
};