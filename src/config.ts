// API Configuration
export const API_ENDPOINTS = process.env.API_ENDPOINTS || 'http://localhost:3001';

// API endpoints - note: the backend adds an additional /api prefix
export const API = {
  SIGNUP: `${API_ENDPOINTS}/api/signup`,
  LOGIN: `${API_ENDPOINTS}/api/login`,
  PORTFOLIO: `${API_ENDPOINTS}/api/portfolio`,  // This will make requests to /api/portfolio/...
};  
