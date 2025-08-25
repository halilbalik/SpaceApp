import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const DatePickerComponent = ({
  isVisible,
  onClose,
  onDateSelect,
  selectedDate = new Date(),
  maxDate = new Date(),
  minDate = new Date('1995-06-16') // NASA APOD başlangıç tarihi
}) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDateChange = (increment) => {
    const newDate = new Date(tempDate);
    newDate.setDate(newDate.getDate() + increment);

    if (newDate >= minDate && newDate <= maxDate) {
      setTempDate(newDate);
    }
  };

  const handleMonthChange = (increment) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(newDate.getMonth() + increment);

    if (newDate >= minDate && newDate <= maxDate) {
      setTempDate(newDate);
    }
  };

  const handleYearChange = (increment) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(newDate.getFullYear() + increment);

    if (newDate >= minDate && newDate <= maxDate) {
      setTempDate(newDate);
    }
  };

  const handleConfirm = () => {
    onDateSelect(formatDate(tempDate));
    onClose();
  };

  const handleToday = () => {
    const today = new Date();
    setTempDate(today);
  };

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tarih Seçin</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.selectedDateText}>
              {formatDisplayDate(tempDate)}
            </Text>
            <Text style={styles.selectedDateSubtext}>
              {formatDate(tempDate)}
            </Text>
          </View>

          <View style={styles.controlsContainer}>
            {/* Yıl Kontrolü */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Yıl</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleYearChange(-1)}
                >
                  <Ionicons name="remove" size={20} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.controlValue}>{tempDate.getFullYear()}</Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleYearChange(1)}
                >
                  <Ionicons name="add" size={20} color="#1e3a8a" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Ay Kontrolü */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Ay</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleMonthChange(-1)}
                >
                  <Ionicons name="remove" size={20} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.controlValue}>
                  {tempDate.toLocaleDateString('tr-TR', { month: 'long' })}
                </Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleMonthChange(1)}
                >
                  <Ionicons name="add" size={20} color="#1e3a8a" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Gün Kontrolü */}
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Gün</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleDateChange(-1)}
                >
                  <Ionicons name="remove" size={20} color="#1e3a8a" />
                </TouchableOpacity>
                <Text style={styles.controlValue}>{tempDate.getDate()}</Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => handleDateChange(1)}
                >
                  <Ionicons name="add" size={20} color="#1e3a8a" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

                    <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={handleToday}
            >
              <Ionicons name="today-outline" size={20} color="#1e3a8a" />
              <Text style={styles.todayButtonText}>Bugün</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  dateContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  selectedDateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  selectedDateSubtext: {
    fontSize: 16,
    color: '#6b7280',
  },
  controlsContainer: {
    marginBottom: 24,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  controlValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  quickActions: {
    alignItems: 'center',
    marginBottom: 24,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  todayButtonText: {
    color: '#1e3a8a',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DatePickerComponent;
