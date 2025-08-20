// Home Screen - Presentation Layer
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Custom hooks and components
import { useNasaAPOD } from '../hooks/useNasaAPOD';
import LoadingComponent from '../components/LoadingComponent';
import ErrorComponent from '../components/ErrorComponent';
import APODImageComponent from '../components/APODImageComponent';
import APODInfoComponent from '../components/APODInfoComponent';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const {
    apodData,
    loading,
    error,
    refreshing,
    refreshAPOD,
    hasData,
    hasError,
    isImage,
  } = useNasaAPOD();

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
            <Text style={styles.headerTitle}>NASA APOD</Text>
          </View>
          <Text style={styles.headerSubtitle}>Astronomy Picture of the Day</Text>
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
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 44,
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
