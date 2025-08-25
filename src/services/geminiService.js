import { API_CONFIG } from '../constants/api';

class GeminiService {
  async translateToTurkish(englishText) {
    try {
      if (!englishText || !API_CONFIG.GEMINI_API_KEY) {
        return {
          success: false,
          data: null,
          error: 'Gemini API anahtarı veya metin bulunamadı',
        };
      }

      const prompt = `Lütfen aşağıdaki İngilizce astronomi açıklamasını Türkçe'ye çevir. Bilimsel terimleri doğru bir şekilde çevir ve anlam bütünlüğünü koru. Sadece çeviriyi ver, başka hiçbir şey ekleme:

${englishText}`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT * 2); // Çeviri için daha uzun timeout

      const response = await fetch(API_CONFIG.GEMINI_API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_CONFIG.GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API Error Response:', errorData);
        throw new Error(`Gemini API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Gemini API\'den geçersiz yanıt');
      }

      const translatedText = data.candidates[0].content.parts[0].text.trim();

      return {
        success: true,
        data: translatedText,
        error: null,
      };

    } catch (error) {
      console.error('❌ Gemini Translation Error:', error);

      let errorMessage = 'Çeviri sırasında bilinmeyen bir hata oluştu';

      if (error.name === 'AbortError') {
        errorMessage = 'Çeviri isteği zaman aşımına uğradı';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Ağ bağlantısı hatası - çeviri yapılamadı';
      } else if (error.message.includes('Gemini API Error')) {
        errorMessage = `Gemini API hatası: ${error.message}`;
      } else if (error.message.includes('API anahtarı')) {
        errorMessage = 'Gemini API anahtarı yapılandırılmamış';
      }

      return {
        success: false,
        data: null,
        error: errorMessage,
      };
    }
  }

  async batchTranslate(textArray) {
    try {
      const promises = textArray.map(text => this.translateToTurkish(text));
      const results = await Promise.allSettled(promises);

      return results.map((result, index) => ({
        originalText: textArray[index],
        ...result.value,
      }));

    } catch (error) {
      console.error('❌ Batch Translation Error:', error);
      return textArray.map(text => ({
        originalText: text,
        success: false,
        data: null,
        error: 'Toplu çeviri hatası',
      }));
    }
  }
}

export default new GeminiService();
