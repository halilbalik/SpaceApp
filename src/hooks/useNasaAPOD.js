// Custom Hook for NASA APOD - Business Logic Layer
import { useState, useEffect, useCallback } from 'react';
import nasaService from '../services/nasaService';

export const useNasaAPOD = (initialDate = null) => {
  const [apodData, setApodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch APOD data
   * @param {string} date - Optional date in YYYY-MM-DD format
   */
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

  /**
   * Refresh data with pull-to-refresh
   */
  const refreshAPOD = useCallback(async () => {
    setRefreshing(true);
    await fetchAPOD();
  }, [fetchAPOD]);

  /**
   * Fetch APOD for specific date
   * @param {string} date - Date in YYYY-MM-DD format
   */
  const fetchAPODForDate = useCallback(async (date) => {
    await fetchAPOD(date);
  }, [fetchAPOD]);

  /**
   * Get today's APOD
   */
  const fetchTodaysAPOD = useCallback(async () => {
    await fetchAPOD(null);
  }, [fetchAPOD]);

  // Initial data fetch
  useEffect(() => {
    fetchAPOD();
  }, [fetchAPOD]);

  // Return hook interface
  return {
    // State
    apodData,
    loading,
    error,
    refreshing,

    // Actions
    refreshAPOD,
    fetchAPODForDate,
    fetchTodaysAPOD,

    // Computed values
    hasData: !!apodData,
    hasError: !!error,
    isImage: apodData?.mediaType === 'image',
    isVideo: apodData?.mediaType === 'video',
  };
};
