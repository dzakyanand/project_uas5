import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect, Slot } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingScreen } from '../../components/common/Loading';
import Navbar from '../../components/ui/Navbar';

export default function MahasiswaLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || user.role !== 'mahasiswa') {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});