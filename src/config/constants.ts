/**
 * Constantes da aplicação.
 * API: Instagram120 (RapidAPI) — posts do Instagram.
 */

const RAPIDAPI_HOST =
  import.meta.env.VITE_RAPIDAPI_HOST ?? 'instagram120.p.rapidapi.com';

export const API_BASE_URL = `https://${RAPIDAPI_HOST}`;

export const API_ENDPOINTS = {
  INSTAGRAM_POSTS: '/api/instagram/posts',
  MEDIA_BY_SHORTCODE: '/api/instagram/mediaByShortcode',
} as const;

export const RAPIDAPI_HEADERS = {
  'Content-Type': 'application/json',
  'x-rapidapi-host': RAPIDAPI_HOST,
  'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY ?? '',
} as const;
