/**
 * Constantes da aplicação.
 * Substitua API_BASE_URL pela URL real da API quando disponível.
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com';

export const API_ENDPOINTS = {
  NEWS: '/noticias',
} as const;

export const SOURCE_OPTIONS = [
  { value: '', label: 'Todas as fontes' },
  { value: 'telegraph', label: 'Telegraph' },
  { value: 'thetimes', label: 'The Times' },
  { value: 'reuters', label: 'Reuters' },
  { value: 'bbc', label: 'BBC' },
  { value: 'guardian', label: 'The Guardian' },
] as const;
