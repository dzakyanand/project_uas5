import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { useAppColors } from '../../../hooks/use-app-colors';
import { mockData } from '../../../constants/data';

const { width } = Dimensions.get('window');

export default function KHScreen() {
  const router = useRouter();
  const colors = useAppColors();
  const [selectedSemester, setSelectedSemester] = useState(5);

  // Data untuk chart
  const chartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: [3.2, 3.5, 3.6, 3.7, 3.75],
        color: (opacity = 1) => `rgba(107, 99, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(107, 99, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6C63FF',
    },
  };

  const khsData = mockData.khsData;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10B981';
      case 'B': return '#3B82F6';
      case 'C': return '#F59E0B';
      case 'D': return '#EF4444';
      case 'E': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface.primary,
    },
    header: {
      padding: 24,
      paddingTop: 60,
      paddingBottom: 40,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: 20,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
    },
    chartCard: {
      backgroundColor: colors.surface.card,
      borderRadius: 20,
      padding: 20,
      margin: 16,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.primary[900],
      marginBottom: 16,
      alignSelf: 'flex-start',
    },
    chart: {
      borderRadius: 16,
    },
    semesterCard: {
      backgroundColor: colors.surface.card,
      borderRadius: 20,
      padding: 20,
      margin: 16,
      marginTop: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
    },
    semesterScroll: {
      marginHorizontal: -4,
    },
    semesterButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: colors.surface.secondary,
      marginHorizontal: 4,
    },
    semesterButtonActive: {
      backgroundColor: '#6C63FF',
    },
    semesterButtonText: {
      fontSize: 14,
      color: colors.neutral[700],
      fontWeight: '500',
    },
    semesterButtonTextActive: {
      color: '#FFFFFF',
    },
    detailCard: {
      backgroundColor: colors.surface.card,
      borderRadius: 20,
      padding: 20,
      margin: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
    },
    semesterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.DEFAULT,
    },
    semesterTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary[900],
    },
    semesterSubtitle: {
      fontSize: 14,
      color: colors.neutral[600],
    },
    ipContainer: {
      alignItems: 'center',
    },
    ipLabel: {
      fontSize: 12,
      color: colors.neutral[500],
      marginBottom: 4,
    },
    ipValue: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#10B981',
    },
    courseList: {
      marginBottom: 20,
    },
    courseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.DEFAULT,
    },
    courseHeaderText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.neutral[600],
      textAlign: 'center',
      flex: 1,
    },
    courseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.DEFAULT,
    },
    courseInfo: {
      flex: 3,
    },
    courseCode: {
      fontSize: 12,
      color: colors.neutral[500],
      marginBottom: 2,
    },
    courseName: {
      fontSize: 14,
      color: colors.neutral[800],
      fontWeight: '500',
    },
    courseSks: {
      fontSize: 14,
      color: colors.neutral[700],
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    courseScore: {
      fontSize: 14,
      color: colors.neutral[700],
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    gradeBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    gradeText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: colors.surface.secondary,
      borderRadius: 12,
      padding: 16,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryLabel: {
      fontSize: 12,
      color: colors.neutral[600],
      marginBottom: 4,
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary[900],
    },
    ipText: {
      color: '#10B981',
    },
    transcriptButton: {
      borderRadius: 16,
      overflow: 'hidden',
      marginHorizontal: 16,
      marginTop: 8,
    },
    transcriptButtonGradient: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    transcriptButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    footerSpace: {
      height: 20,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#6C63FF', '#8A84FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kartu Hasil Studi</Text>
        <Text style={styles.headerSubtitle}>IPK: 3.75 | Total SKS: 120</Text>
      </LinearGradient>

      {/* IPK Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>Perkembangan IPK</Text>
        <LineChart
          data={chartData}
          width={width - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Semester Selector */}
      <View style={styles.semesterCard}>
        <Text style={styles.sectionTitle}>Pilih Semester</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.semesterScroll}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
            <TouchableOpacity
              key={semester}
              style={[
                styles.semesterButton,
                selectedSemester === semester && styles.semesterButtonActive,
              ]}
              onPress={() => setSelectedSemester(semester)}
            >
              <Text
                style={[
                  styles.semesterButtonText,
                  selectedSemester === semester && styles.semesterButtonTextActive,
                ]}
              >
                Semester {semester}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* KHS Detail */}
      <View style={styles.detailCard}>
        <View style={styles.semesterHeader}>
          <View>
            <Text style={styles.semesterTitle}>
              Semester {selectedSemester}
            </Text>
            <Text style={styles.semesterSubtitle}>2023/2024 Ganjil</Text>
          </View>
          <View style={styles.ipContainer}>
            <Text style={styles.ipLabel}>IP Semester</Text>
            <Text style={styles.ipValue}>3.75</Text>
          </View>
        </View>

        {/* Mata Kuliah List */}
        <View style={styles.courseList}>
          <View style={styles.courseHeader}>
            <Text style={styles.courseHeaderText}>Mata Kuliah</Text>
            <Text style={styles.courseHeaderText}>SKS</Text>
            <Text style={styles.courseHeaderText}>Nilai</Text>
            <Text style={styles.courseHeaderText}>Grade</Text>
          </View>

          {khsData
            .filter((item) => item.semester === selectedSemester)
            .map((item, index) => (
              <View key={index} style={styles.courseRow}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseCode}>{item.kode}</Text>
                  <Text style={styles.courseName}>{item.nama}</Text>
                </View>
                <Text style={styles.courseSks}>{item.sks}</Text>
                <Text style={styles.courseScore}>{item.nilai}</Text>
                <View style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeColor(item.grade) }
                ]}>
                  <Text style={styles.gradeText}>{item.grade}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total SKS</Text>
            <Text style={styles.summaryValue}>18</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>SKS Lulus</Text>
            <Text style={styles.summaryValue}>18</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>IP Semester</Text>
            <Text style={[styles.summaryValue, styles.ipText]}>3.75</Text>
          </View>
        </View>
      </View>

      {/* Transkrip Button */}
      <TouchableOpacity style={styles.transcriptButton}>
        <LinearGradient
          colors={['#36D1DC', '#5B86E5']}
          style={styles.transcriptButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.transcriptButtonText}>
            📄 Lihat Transkrip Lengkap
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}