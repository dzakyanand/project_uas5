import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../components/common/Button';
import { useAppColors } from '../../../hooks/use-app-colors';

interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
}

export default function PesanList() {
  const colors = useAppColors();
  const [convs, setConvs] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem('conversations');
      setConvs(raw ? JSON.parse(raw) : []);
    };
    load();
  }, []);

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.surface.primary },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    title: { fontSize: 20, fontWeight: '700', color: colors.text.primary },
    empty: { textAlign: 'center', marginTop: 32, color: colors.neutral[500] },
    row: { padding: 12, borderRadius: 12, backgroundColor: colors.surface.card, marginBottom: 12, borderWidth: 1, borderColor: colors.border.DEFAULT },
    convTitle: { fontWeight: '700', color: colors.text.primary },
    convSub: { color: colors.neutral[600], marginTop: 4 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Pesan</Text>
        <Button title="Buat" onPress={() => router.push('/mahasiswa/pesan/new')} />
      </View>

      <FlatList
        data={convs}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada percakapan.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => router.push(`/mahasiswa/pesan/${item.id}`)}>
            <View>
              <Text style={styles.convTitle}>{item.title}</Text>
              <Text style={styles.convSub}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
