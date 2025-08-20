// APOD Image Component - Reusable UI Component
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const APODImageComponent = ({ apodData, isImage }) => {
  if (isImage && apodData?.url) {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: apodData.hdurl || apodData.url }}
          style={styles.image}
          contentFit="cover"
          placeholder="🌌"
          transition={1000}
        />
      </View>
    );
  }

  // Video or unsupported media type
  return (
    <View style={styles.videoContainer}>
      <Ionicons name="play-circle-outline" size={64} color="#1e3a8a" />
      <Text style={styles.videoText}>
        {apodData?.mediaType === 'video'
          ? 'Video içeriği web\'de görüntülenebilir'
          : 'Medya türü desteklenmiyor'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 250,
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    padding: 40,
    marginBottom: 24,
  },
  videoText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default APODImageComponent;
