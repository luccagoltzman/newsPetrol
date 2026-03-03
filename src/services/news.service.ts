/**
 * Serviço de comunicação com a API de notícias de petróleo e gás.
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/config/constants';
import type { NewsArticle, NewsApiParams } from '@/types/news.types';

const buildUrl = (params?: NewsApiParams): string => {
  const url = new URL(API_ENDPOINTS.NEWS, API_BASE_URL);
  if (params?.source?.trim()) {
    url.searchParams.set('source', params.source.trim());
  }
  return url.toString();
};

export async function fetchNews(params?: NewsApiParams): Promise<NewsArticle[]> {
  const url = buildUrl(params);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao carregar notícias: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (data?.articles && Array.isArray(data.articles)) {
    return data.articles;
  }

  if (data?.title && data?.url) {
    return [data as NewsArticle];
  }

  return [];
}
