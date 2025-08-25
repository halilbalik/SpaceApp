import { useState, useEffect, useCallback } from 'react';
import nasaService from '../services/nasaService';

export const useNasaAPOD = (initialDate = null) => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAPOD = useCallback(async (date = initialDate) => {
    try {
      setLoading(true);
      setError(null);

      const result = await nasaService.getAPOD(date);

      if (result.success) {
        setApodData(result.data);
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
  }, [initialDate]);

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
    hasData: !!apodData,
    hasError: !!error,
    isImage: apodData?.mediaType === 'image',
    isVideo: apodData?.mediaType === 'video',
  };
};
