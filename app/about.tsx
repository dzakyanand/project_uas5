import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function AboutPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={isDarkMode ? {...styles.container, ...styles.containerDark} : styles.container}>
      <Text style={styles.title}>About Mini SIAKAD</Text>
      <Text style={styles.paragraph}>This minimal SIAKAD demo shows basic navigation, profile and biodata management designed for student exercises.</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/home')}>
        <Text style={styles.btnText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  containerDark: { backgroundColor: '#0b1220' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  paragraph: { fontSize: 14, color: '#4b5563', marginBottom: 20 },
  btn: { padding: 12, backgroundColor: '#374151', borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' },
});
