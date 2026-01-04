import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../constants/colors';

interface TaskCardProps {
  task: {
    id: string;
    judul: string;
    mataKuliah: string;
    deadline: string;
    status: 'belum' | 'dikerjakan' | 'selesai';
    prioritas?: 'tinggi' | 'sedang' | 'rendah';
  };
  onPress?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case 'belum':
        return colors.error[500];
      case 'dikerjakan':
        return colors.warning[500];
      case 'selesai':
        return colors.success[500];
      default:
        return colors.neutral[400];
    }
  };

  const getPriorityColor = () => {
    switch (task.prioritas) {
      case 'tinggi':
        return colors.error[500];
      case 'sedang':
        return colors.warning[500];
      case 'rendah':
        return colors.success[500];
      default:
        return colors.neutral[400];
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>
            {task.status === 'belum' ? 'Belum Dikerjakan' : 
             task.status === 'dikerjakan' ? 'Sedang Dikerjakan' : 'Selesai'}
          </Text>
        </View>
        
        {task.prioritas && (
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.priorityText}>
              {task.prioritas === 'tinggi' ? '🚨 Tinggi' :
               task.prioritas === 'sedang' ? '⚠️ Sedang' : '✅ Rendah'}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title}>{task.judul}</Text>
      
      <View style={styles.courseContainer}>
        <Text style={styles.courseLabel}>Mata Kuliah:</Text>
        <Text style={styles.courseName}>{task.mataKuliah}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.deadlineContainer}>
          <Text style={styles.deadlineLabel}>⏰ Deadline:</Text>
          <Text style={styles.deadlineText}>{formatDate(task.deadline)}</Text>
        </View>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>
            {task.status === 'selesai' ? '📋 Lihat' : '✏️ Kerjakan'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: colors.neutral[600],
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[800],
    marginBottom: 8,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    marginRight: 4,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary[700],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
    paddingTop: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineLabel: {
    fontSize: 12,
    color: colors.neutral[600],
    marginRight: 4,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral[800],
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary[700],
  },
});

export default TaskCard;