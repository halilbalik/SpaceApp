import { API_CONFIG, getFullApiUrl } from '../constants/api';

class NasaService {
  async getAPOD(date = null) {
    try {
      const url = getFullApiUrl(date);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: API_CONFIG.HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: this.transformAPODData(data),
        error: null,
      };

    } catch (error) {
      console.error('❌ NASA API Error:', error);

      let errorMessage = 'Bilinmeyen bir hata oluştu';

      if (error.name === 'AbortError') {
        errorMessage = 'İstek zaman aşımına uğradı';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Ağ bağlantısı hatası';
      } else if (error.message.includes('NASA API Error')) {
        errorMessage = error.message;
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  }

  transformAPODData(rawData) {
    return {
      title: rawData.title || 'Başlık bulunamadı',
      explanation: rawData.explanation || 'Açıklama bulunamadı',
      url: rawData.url || null,
      hdurl: rawData.hdurl || rawData.url || null,
      date: rawData.date || new Date().toISOString().split('T')[0],
      mediaType: rawData.media_type || 'image',
      copyright: rawData.copyright || null,
      serviceVersion: rawData.service_version || 'v1',
    };
  }

  async getMultipleAPOD(dates) {
    try {
      const promises = dates.map(date => this.getAPOD(date));
      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        date: dates[index],
        ...result.value,
      }));

    } catch (error) {
      console.error('❌ Multiple APOD Error:', error);
      return [];
    }
  }
}

export default new NasaService();
