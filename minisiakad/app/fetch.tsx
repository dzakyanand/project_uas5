import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function FetchDataPage() {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
      if (!res.ok) throw new Error('Network response not ok');
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Fetch error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <View style={isDarkMode ? {...styles.container, ...styles.dark} : styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.info}>Loading...</Text>
    </View>
  );

  return (
    <View style={isDarkMode ? {...styles.container, ...styles.dark} : styles.container}>
      <Text style={styles.title}>Fetch Demo (JSONPlaceholder)</Text>

      {error ? (
        <View style={styles.center}>
          <Text style={styles.error}>Error: {error}</Text>
          <TouchableOpacity style={styles.btn} onPress={load}><Text style={styles.btnText}>Retry</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  dark: { backgroundColor: '#0b1220' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  info: { marginTop: 8 },
  center: { alignItems: 'center' },
  error: { color: '#ef4444', marginBottom: 8 },
  btn: { padding: 10, backgroundColor: '#374151', borderRadius: 8 },
  btnText: { color: '#fff' },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#f8fafc', marginBottom: 10 },
  cardTitle: { fontWeight: '700', marginBottom: 6 },
  cardBody: { color: '#374151' },
});
