import settings from '../../appsettings.json';

export const API_CONFIG = {
  NASA_API_KEY: settings.NASA_API_KEY,
  NASA_API_BASE_URL: settings.NASA_API_BASE_URL,

  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

export const getFullApiUrl = (date = null) => {
  const baseUrl = `${API_CONFIG.NASA_API_BASE_URL}?api_key=${API_CONFIG.NASA_API_KEY}`;
  return date ? `${baseUrl}&date=${date}` : baseUrl;
};
