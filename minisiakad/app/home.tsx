import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function HomePage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={isDarkMode ? {...styles.container, ...styles.containerDark} : styles.container}>
      <Text style={styles.title}>Home</Text>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/mahasiswa/profile')}>
        <Icon name="account" size={20} color="#fff" />
        <Text style={styles.btnText}>Go to Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/mahasiswa/profile')}>
        <Icon name="file-document" size={20} color="#fff" />
        <Text style={styles.btnText}>View Biodata</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => router.push('/about')}>
        <Icon name="information" size={20} color="#fff" />
        <Text style={styles.btnText}>About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  containerDark: { backgroundColor: '#0b1220' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#374151', borderRadius: 10, marginBottom: 12 },
  btnText: { color: '#fff', fontWeight: '600', marginLeft: 8 },
});
