import { useState, useEffect, useCallback } from 'react';
import nasaService from '../services/nasaService';
import geminiService from '../services/geminiService';

export const useNasaAPOD = (initialDate = null) => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [turkishExplanation, setTurkishExplanation] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const translateExplanation = useCallback(async (explanation) => {
    try {
      setTranslating(true);
      setTranslationError(null);

      const result = await geminiService.translateToTurkish(explanation);

      if (result.success) {
        setTurkishExplanation(result.data);
      } else {
        setTranslationError(result.error);
      }

    } catch (err) {
      console.error('Translation Error:', err);
      setTranslationError('Çeviri sırasında bir hata oluştu');
    } finally {
      setTranslating(false);
    }
  }, []);

  const fetchAPOD = useCallback(async (date = initialDate) => {
    try {
      setLoading(true);
      setError(null);
      setTurkishExplanation(null);
      setTranslationError(null);

      const result = await nasaService.getAPOD(date);

      if (result.success) {
        setApodData(result.data);
        // APOD verisi yüklendikten sonra otomatik çeviri başlat
        if (result.data?.explanation) {
          translateExplanation(result.data.explanation);
        }
      } else {
        setError(result.error);
      }

    } catch (err) {
      console.error('Hook Error:', err);
      setError('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialDate, translateExplanation]);

  const refreshAPOD = useCallback(async () => {
    setRefreshing(true);
    await fetchAPOD();
  }, [fetchAPOD]);

  const fetchAPODForDate = useCallback(async (date) => {
    await fetchAPOD(date);
  }, [fetchAPOD]);

  const fetchTodaysAPOD = useCallback(async () => {
    await fetchAPOD(null);
  }, [fetchAPOD]);

  useEffect(() => {
    fetchAPOD();
  }, [fetchAPOD]);

  return {
    apodData,
    loading,
    error,
    refreshing,
    refreshAPOD,
    fetchAPODForDate,
    fetchTodaysAPOD,
    translateExplanation,
    turkishExplanation,
    translating,
    translationError,
    hasData: !!apodData,
    hasError: !!error,
    isImage: apodData?.mediaType === 'image',
    isVideo: apodData?.mediaType === 'video',
    hasTranslation: !!turkishExplanation,
    hasTranslationError: !!translationError,
  };
};
