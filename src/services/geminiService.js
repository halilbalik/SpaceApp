import { API_CONFIG } from '../constants/api';

class GeminiService {
  async createBirthdayComment(englishText, birthDate) {
    try {
      if (!englishText || !API_CONFIG.GEMINI_API_KEY) {
        return {
          success: false,
          data: null,
          error: 'Gemini API anahtarı veya metin bulunamadı',
        };
      }

      // Tarih formatını düzenle - güvenli parsing
      const birthDateObj = birthDate ? new Date(birthDate) : new Date();
      const formattedDate = birthDateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Burç hesaplama
      const month = birthDateObj.getMonth() + 1;
      const day = birthDateObj.getDate();

      const getZodiacSign = (month, day) => {
        if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Koç";
        if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Boğa";
        if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "İkizler";
        if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Yengeç";
        if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Aslan";
        if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Başak";
        if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Terazi";
        if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Akrep";
        if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Yay";
        if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Oğlak";
        if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Kova";
        return "Balık";
      };

      const zodiacSign = getZodiacSign(month, day);

      const prompt = `Sen bir astrolog ve kişilik uzmanısın. Aşağıdaki bilgilerle kişiliğe odaklı astrolojik yorum yap:

Doğum Tarihi: ${formattedDate}
Burç: ${zodiacSign}
O günün gökyüzü olayı: ${englishText}

Kişiliğe odaklı astrolojik yorum yaz:
- ${zodiacSign} burcundaki kişinin karakter özelliklerini detaylı analiz et
- O günün gökyüzü olayının kişiliğine nasıl yansıdığını açıkla
- Güçlü yanlarını ve potansiyelini vurgula
- Hayat yaklaşımı ve duygusal yapısı hakkında yorumla
- Anlaşılır ama derinlemesine kişilik analizi yap
- 3-4 cümle ile yaz
- Türkçe kullan
- "Siz" diye hitap et

Örnek stil: "Doğduğunuz günün gökyüzündeki [olay] sizin derin [kişilik özelliği] karakterinizi yansıtıyor. ${zodiacSign} burcu olarak [karakter analizi]. Bu kozmik etki, [kişilik derinliği] yanınızı güçlendirmiş. [Hayat yaklaşımı yorumu]."`;

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          topK: 35,
          topP: 0.85,
          maxOutputTokens: 600,
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
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT * 3); // Daha uzun timeout

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

      const birthdayComment = data.candidates[0].content.parts[0].text.trim();

      return {
        success: true,
        data: birthdayComment,
        error: null,
      };

    } catch (error) {
      console.error('❌ Gemini Birthday Comment Error:', error);

      let errorMessage = 'Doğum günü yorumu oluşturulurken hata oluştu';

      if (error.name === 'AbortError') {
        errorMessage = 'Doğum günü yorumu isteği zaman aşımına uğradı';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Ağ bağlantısı hatası - doğum günü yorumu yapılamadı';
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
