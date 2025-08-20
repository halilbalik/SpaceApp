// API Configuration Constants
import { NASA_API_KEY, NASA_API_BASE_URL } from '@env';

export const API_CONFIG = {
  NASA_API_KEY: NASA_API_KEY || 'DEMO_KEY',
  NASA_API_BASE_URL: NASA_API_BASE_URL || 'https://api.nasa.gov/planetary/apod',

  // Request Configurations
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Debug function - .env dosyasından BASE_URL kullanıyor
export const getFullApiUrl = (date = null) => {
  const baseUrl = `${API_CONFIG.NASA_API_BASE_URL}?api_key=${API_CONFIG.NASA_API_KEY}`;
  return date ? `${baseUrl}&date=${date}` : baseUrl;
};
