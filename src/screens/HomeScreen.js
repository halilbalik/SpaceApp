import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useNasaAPOD } from '../hooks/useNasaAPOD';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import APODImageComponent from '../components/APODImageComponent';
import APODInfoComponent from '../components/APODInfoComponent';
import DatePickerComponent from '../components/DatePickerComponent';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    apodData,
    loading,
    error,
    refreshing,
    refreshAPOD,
    hasData,
    hasError,
    isImage,
    fetchAPODForDate,
    turkishExplanation,
    translating,
    translationError,
    hasTranslation,
    hasTranslationError,
    translateExplanation,
    astrologicalComment,
    astrologicalLoading,
    astrologicalError,
    hasAstrologicalComment,
    hasAstrologicalError,
  } = useNasaAPOD();

  const handleDateSelect = async (dateString) => {
    try {
      await fetchAPODForDate(dateString);
      setSelectedDate(new Date(dateString));
    } catch (error) {
      console.error('Tarih seçimi hatası:', error);
    }
  };

  const handleTodayPress = async () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    setSelectedDate(today);
    await fetchAPODForDate(null);
  };

      const formatDisplayDate = (date) => {
    if (!date) return 'Bugün';
    const today = new Date().toDateString();
    const selectedDateString = date.toDateString();

    if (today === selectedDateString) {
      return 'Bugün';
    }

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return <LoadingComponent />;
  }

  if (hasError && !hasData) {
    return (
      <ErrorComponent
        error={error}
        onRetry={refreshAPOD}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAPOD}
            colors={['#1e3a8a']}
            tintColor="#1e3a8a"
          />
                }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="telescope-outline" size={32} color="#1e3a8a" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>NASA APOD</Text>
              <Text style={styles.headerSubtitle}>Astronomy Picture of the Day</Text>
            </View>
          </View>
        </View>

        <View style={styles.dateSelector}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setIsDatePickerVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={18} color="#1e3a8a" />
            <Text style={styles.dateButtonText}>
              {formatDisplayDate(selectedDate)}
            </Text>
            <Ionicons name="chevron-down-outline" size={14} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.todayButton}
            onPress={handleTodayPress}
            activeOpacity={0.7}
          >
            <Ionicons name="today-outline" size={16} color="#1e3a8a" />
            <Text style={styles.todayButtonText}>Bugün</Text>
          </TouchableOpacity>
        </View>

        {hasError && hasData && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color="#dc2626" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {hasData && (
          <View style={styles.content}>
            <APODInfoComponent apodData={apodData}             />

            <APODImageComponent
              apodData={apodData}
              isImage={isImage}
            />

            <View style={styles.explanationContainer}>
              <View style={styles.englishExplanationContainer}>
                <View style={styles.explanationHeader}>
                  <Text style={styles.explanationTitle}>Açıklama (İngilizce)</Text>
                  <View style={styles.nasaTag}>
                    <Ionicons name="rocket-outline" size={12} color="#1e3a8a" />
                    <Text style={styles.nasaTagText}>NASA</Text>
                  </View>
                </View>
                <Text style={styles.explanationText}>
                  {apodData.explanation}
                </Text>
              </View>

              {hasTranslation && (
                <View style={styles.turkishExplanationContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Türkçe Açıklama</Text>
                    <View style={styles.geminiTag}>
                      <Ionicons name="sparkles" size={12} color="#8b5cf6" />
                      <Text style={styles.geminiTagText}>Gemini AI</Text>
                    </View>
                  </View>
                  <Text style={styles.explanationText}>
                    {turkishExplanation}
                  </Text>
                </View>
              )}

              {translating && (
                <View style={styles.translatingContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Türkçe Açıklama</Text>
                    <View style={styles.geminiTag}>
                      <Ionicons name="sparkles" size={12} color="#8b5cf6" />
                      <Text style={styles.geminiTagText}>Gemini AI</Text>
                    </View>
                  </View>
                  <View style={styles.translatingContent}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.translatingText}>Çeviri yapılıyor...</Text>
                  </View>
                </View>
              )}

              {hasTranslationError && !translating && (
                <View style={styles.translationErrorContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Türkçe Açıklama</Text>
                    <TouchableOpacity
                      style={styles.retryTranslationButton}
                      onPress={() => translateExplanation(apodData.explanation)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh-outline" size={14} color="#1e3a8a" />
                      <Text style={styles.retryTranslationText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.errorContent}>
                    <Ionicons name="warning-outline" size={16} color="#dc2626" />
                    <Text style={styles.translationErrorText}>{translationError}</Text>
                  </View>
                </View>
              )}

              {hasAstrologicalComment && (
                <View style={styles.birthdayCommentContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Astrolojik Yorum</Text>
                    <View style={styles.birthdayTag}>
                      <Ionicons name="star" size={12} color="#ec4899" />
                      <Text style={styles.birthdayTagText}>Kişilik</Text>
                    </View>
                  </View>
                  <Text style={styles.explanationText}>
                    {astrologicalComment}
                  </Text>
                </View>
              )}

              {astrologicalLoading && (
                <View style={styles.translatingContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Astrolojik Yorum</Text>
                    <View style={styles.birthdayTag}>
                      <Ionicons name="star" size={12} color="#ec4899" />
                      <Text style={styles.birthdayTagText}>Kişilik</Text>
                    </View>
                  </View>
                  <View style={styles.translatingContent}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={styles.translatingText}>Kişiliğiniz analiz ediliyor...</Text>
                  </View>
                </View>
              )}

              {hasAstrologicalError && !astrologicalLoading && (
                <View style={styles.translationErrorContainer}>
                  <View style={styles.explanationHeader}>
                    <Text style={styles.explanationTitle}>Astrolojik Yorum</Text>
                    <TouchableOpacity
                      style={styles.retryTranslationButton}
                      onPress={() => translateExplanation(apodData.explanation, true, selectedDate?.toISOString?.()?.split('T')[0])}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh-outline" size={14} color="#1e3a8a" />
                      <Text style={styles.retryTranslationText}>Tekrar Dene</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.errorContent}>
                    <Ionicons name="warning-outline" size={16} color="#dc2626" />
                    <Text style={styles.translationErrorText}>{astrologicalError}</Text>
                  </View>
                </View>
              )}
            </View>

            {apodData.copyright && (
              <View style={styles.copyrightContainer}>
                <Ionicons name="camera-outline" size={16} color="#9ca3af" />
                <Text style={styles.copyrightText}>
                  © {apodData.copyright}
                </Text>
              </View>
            )}
          </View>
        )}
            </ScrollView>

      <DatePickerComponent
        isVisible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flex: 1,
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
    marginLeft: 4,
    marginRight: 4,
    flex: 1,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  todayButtonText: {
    fontSize: 11,
    color: '#1e3a8a',
    fontWeight: '600',
    marginLeft: 4,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#dc2626',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  content: {
    padding: 20,
  },
  explanationContainer: {
    marginBottom: 24,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  explanationText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'justify',
  },
  turkishExplanationContainer: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  birthdayCommentContainer: {
    backgroundColor: '#fdf2f8',
    borderLeftWidth: 4,
    borderLeftColor: '#ec4899',
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  englishExplanationContainer: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  originalExplanationContainer: {
    marginBottom: 16,
  },
  geminiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5d3ff',
  },
  geminiTagText: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
    marginLeft: 4,
  },
  birthdayTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f9a8d4',
  },
  birthdayTagText: {
    fontSize: 10,
    color: '#ec4899',
    fontWeight: '600',
    marginLeft: 4,
  },
  nasaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  nasaTagText: {
    fontSize: 10,
    color: '#1e3a8a',
    fontWeight: '600',
    marginLeft: 4,
  },
  translatingContainer: {
    backgroundColor: '#fffbeb',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  translatingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  translatingText: {
    fontSize: 14,
    color: '#92400e',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  translationErrorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 16,
    marginBottom: 20,
    borderRadius: 8,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  translationErrorText: {
    fontSize: 14,
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
  },
  retryTranslationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  retryTranslationText: {
    fontSize: 10,
    color: '#1e3a8a',
    fontWeight: '600',
    marginLeft: 4,
  },
  copyrightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  copyrightText: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 6,
  },
});

export default HomeScreen;
