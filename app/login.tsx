import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useAuth } from '../contexts/AuthContext';
import { mockUsers } from '../data/mockUsers';

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();


  const handleSignIn = async () => {
    const nimTrim = nim.trim();
    const pwd = password;

    const found = mockUsers.find((u) => u.nim === nimTrim && u.password === pwd);
    if (!found) {
      Alert.alert('Login Gagal', 'NIM atau password salah');
      return;
    }

    const user = {
      id: found.id,
      nim: found.nim,
      nama: found.nama,
      email: found.email,
      role: found.role as any,
      prodi: found.prodi,
      angkatan: found.angkatan,
    };

    setIsSubmitting(true);
    try {
      await login(user as any);
      router.replace('/mahasiswa' as any);
    } catch (err) {
      Alert.alert('Login Error', 'Terjadi kesalahan saat masuk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={isDark ? ['#0f172a', '#0a0e27'] : ['#f8fafc', '#ffffff']}
      style={[styles.container, isDark && styles.containerDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Icon name="school" size={28} color={isDark ? '#60a5fa' : '#667eea'} />
        </View>
        <Text style={[styles.title, isDark && styles.titleDark]}>DZ University</Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Sign in to your account</Text>
      </View>

      <View style={[styles.card, isDark && styles.cardDark]}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>NIM</Text>
          <TextInput
            value={nim}
            onChangeText={setNim}
            placeholder="202012345"
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.3)'}
            style={[styles.input, isDark && styles.inputDark]}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.3)'}
            style={[styles.input, isDark && styles.inputDark]}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotRow} onPress={() => router.push('/forgot' as any) } activeOpacity={0.7}>
          <Text style={[styles.forgotText, isDark && styles.forgotTextDark]}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
          onPress={handleSignIn}
          activeOpacity={0.8}
          disabled={isSubmitting}
        >
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Signing in...' : 'Sign In'}</Text>
          <Icon name="arrow-right" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.altRow}>
          <Text style={[styles.altText, isDark && styles.altTextDark]}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/register' as any)}>
            <Text style={styles.linkText}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  containerDark: {
    backgroundColor: '#0a0e27',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: 'rgba(102,126,234,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  titleDark: { color: '#FFFFFF' },
  subtitle: { color: '#64748b' },
  subtitleDark: { color: 'rgba(255,255,255,0.7)' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardDark: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 12, color: '#334155', marginBottom: 6, fontWeight: '600' },
  labelDark: { color: 'rgba(255,255,255,0.8)' },
  input: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, color: '#0f172a' },
  inputDark: { backgroundColor: 'rgba(255,255,255,0.03)', color: '#FFFFFF' },
  forgotRow: { alignItems: 'flex-end', marginBottom: 12 },
  forgotText: { color: '#64748b' },
  forgotTextDark: { color: 'rgba(255,255,255,0.6)' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 12,
  },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  altRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 14 },
  altText: { color: '#64748b' },
  altTextDark: { color: 'rgba(255,255,255,0.7)' },
  linkText: { color: '#667eea', fontWeight: '700' },
  primaryButtonDisabled: { opacity: 0.6 },
});
