// Home Screen - Presentation Layer
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

// Custom hooks and components
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
    await fetchAPODForDate(null); // null bugünkü tarihi getirir
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

  // Loading state
  if (loading && !refreshing) {
    return <LoadingComponent />;
  }

  // Error state
  if (hasError && !hasData) {
    return (
      <ErrorComponent
        error={error}
        onRetry={refreshAPOD}
      />
    );
  }

  // Success state with data
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
                {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="telescope-outline" size={32} color="#1e3a8a" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>NASA APOD</Text>
              <Text style={styles.headerSubtitle}>Astronomy Picture of the Day</Text>
            </View>
          </View>
        </View>

        {/* Compact Date Selector */}
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

        {/* Error banner (if error but we have cached data) */}
        {hasError && hasData && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={20} color="#dc2626" />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        {/* APOD Content */}
        {hasData && (
          <View style={styles.content}>
            {/* APOD Info (Date, Title) */}
            <APODInfoComponent apodData={apodData} />

            {/* APOD Media (Image/Video) */}
            <APODImageComponent
              apodData={apodData}
              isImage={isImage}
            />

            {/* APOD Explanation */}
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Açıklama</Text>
              <Text style={styles.explanationText}>
                {apodData.explanation}
              </Text>
            </View>

            {/* Copyright info */}
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

      {/* Date Picker Modal */}
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
  explanationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    textAlign: 'justify',
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
