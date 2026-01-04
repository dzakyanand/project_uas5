import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';

interface CourseCardProps {
  course: {
    id: string;
    kode: string;
    nama: string;
    waktu: string;
    ruangan: string;
    dosen: string;
    status?: 'sedang_berjalan' | 'akan_datang' | 'selesai';
  };
  onPress?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const getStatusColor = () => {
    switch (course.status) {
      case 'sedang_berjalan':
        return colors.success;
      case 'akan_datang':
        return colors.warning;
      case 'selesai':
        return colors.neutral[400];
      default:
        return colors.neutral[300];
    }
  };

  const getStatusText = () => {
    switch (course.status) {
      case 'sedang_berjalan':
        return 'Sedang Berjalan';
      case 'akan_datang':
        return 'Akan Datang';
      case 'selesai':
        return 'Selesai';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.courseCodeContainer}>
          <Text style={styles.courseCode}>{course.kode}</Text>
        </View>
        {course.status && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.courseName}>{course.nama}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>⏰</Text>
          <Text style={styles.detailText}>{course.waktu}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>📍</Text>
          <Text style={styles.detailText}>{course.ruangan}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>👨‍🏫</Text>
          <Text style={styles.detailText}>{course.dosen}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCodeContainer: {
    backgroundColor: colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  courseCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary[700],
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[800],
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.neutral[600],
  },
});

export default CourseCard;