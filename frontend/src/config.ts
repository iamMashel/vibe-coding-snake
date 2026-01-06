// In production (Docker/Nginx), use relative path to allow proxying.
// In development, use full URL to backend.
export const API_URL = import.meta.env.PROD
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

export const API_BASE = `${API_URL}/api`;
