import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const APODInfoComponent = ({ apodData }) => {
  if (!apodData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={20} color="#6b7280" />
        <Text style={styles.dateText}>{apodData.date}</Text>
      </View>

      <Text style={styles.title}>{apodData.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    lineHeight: 32,
  },
});

export default APODInfoComponent;
