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
  const [astrologicalComment, setAstrologicalComment] = useState(null);
  const [astrologicalLoading, setAstrologicalLoading] = useState(false);
  const [astrologicalError, setAstrologicalError] = useState(null);

  const translateExplanation = useCallback(async (explanation, isAstrological = false, date = null) => {
    try {
      if (isAstrological) {
        setAstrologicalLoading(true);
        setAstrologicalError(null);
      } else {
        setTranslating(true);
        setTranslationError(null);
      }

      let result;
      if (isAstrological) {
        result = await geminiService.createBirthdayComment(explanation, date);
      } else {
        result = await geminiService.translateToTurkish(explanation);
      }

      if (result.success) {
        if (isAstrological) {
          setAstrologicalComment(result.data);
        } else {
          setTurkishExplanation(result.data);
        }
      } else {
        if (isAstrological) {
          setAstrologicalError(result.error);
        } else {
          setTranslationError(result.error);
        }
      }

    } catch (err) {
      console.error('Translation Error:', err);
      if (isAstrological) {
        setAstrologicalError('Astrolojik yorum sırasında bir hata oluştu');
      } else {
        setTranslationError('Çeviri sırasında bir hata oluştu');
      }
    } finally {
      if (isAstrological) {
        setAstrologicalLoading(false);
      } else {
        setTranslating(false);
      }
    }
  }, []);

  const fetchAPOD = useCallback(async (date = initialDate) => {
    try {
      setLoading(true);
      setError(null);
      setTurkishExplanation(null);
      setTranslationError(null);
      setAstrologicalComment(null);
      setAstrologicalError(null);

      const result = await nasaService.getAPOD(date);

      if (result.success) {
        setApodData(result.data);
        if (result.data?.explanation) {
          translateExplanation(result.data.explanation, false);
          const astroDate = date || new Date().toISOString().split('T')[0];
          translateExplanation(result.data.explanation, true, astroDate);
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
    astrologicalComment,
    astrologicalLoading,
    astrologicalError,
    hasData: !!apodData,
    hasError: !!error,
    isImage: apodData?.mediaType === 'image',
    isVideo: apodData?.mediaType === 'video',
    hasTranslation: !!turkishExplanation,
    hasTranslationError: !!translationError,
    hasAstrologicalComment: !!astrologicalComment,
    hasAstrologicalError: !!astrologicalError,
  };
};
