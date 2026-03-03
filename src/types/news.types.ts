/**
 * Tipos relacionados à API de notícias de petróleo e gás.
 */

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
}

export interface NewsApiParams {
  source?: string;
}

export interface NewsApiResponse {
  articles?: NewsArticle[];
  error?: string;
}
