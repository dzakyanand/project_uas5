import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// lightweight id generator to avoid requiring uuid typings
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
import { useAppColors } from '../../../hooks/use-app-colors';

export default function Conversation() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useAppColors();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const listRef = useRef<FlatList>(null as any);

  useEffect(() => {
    const load = async () => {
      if (id === 'new') return;
      const raw = await AsyncStorage.getItem(`messages_${id}`);
      setMessages(raw ? JSON.parse(raw) : []);
    };
    load();
  }, [id]);

  const send = async () => {
    if (!text.trim()) return;
    if (id === 'new') {
      // create a new conversation id
      const convId = uid();
      const msg = { id: uid(), text, fromMe: true, createdAt: Date.now() };
      await AsyncStorage.setItem(`messages_${convId}`, JSON.stringify([msg]));
      // also add to conversations list
      const raw = await AsyncStorage.getItem('conversations');
      const convs = raw ? JSON.parse(raw) : [];
      convs.unshift({ id: convId, title: 'Pesan Baru', lastMessage: msg.text });
      await AsyncStorage.setItem('conversations', JSON.stringify(convs));
      router.replace(`/mahasiswa/pesan/${convId}`);
      return;
    }

    const msg = { id: uid(), text, fromMe: true, createdAt: Date.now() };
    const raw = await AsyncStorage.getItem(`messages_${id}`);
    const msgs = raw ? JSON.parse(raw) : [];
    const updated = [...msgs, msg];
    await AsyncStorage.setItem(`messages_${id}`, JSON.stringify(updated));
    // update conversations lastMessage
    const convRaw = await AsyncStorage.getItem('conversations');
    const convs = convRaw ? JSON.parse(convRaw) : [];
    const idx = convs.findIndex((c: any) => c.id === id);
    if (idx >= 0) { convs[idx].lastMessage = msg.text; await AsyncStorage.setItem('conversations', JSON.stringify(convs)); }
    setMessages(updated);
    setText('');
    setTimeout(() => listRef.current?.scrollToEnd?.(), 100);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 12, backgroundColor: colors.surface.primary },
    msg: { padding: 10, borderRadius: 12, marginBottom: 8, maxWidth: '80%' },
    msgIn: { backgroundColor: colors.surface.card, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border.DEFAULT },
    msgOut: { backgroundColor: colors.primary[600], alignSelf: 'flex-end' },
    composer: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
    input: { flex: 1, backgroundColor: colors.surface.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border.DEFAULT },
    sendButton: { backgroundColor: colors.primary[600], paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, marginLeft: 8 },
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={[styles.msg, item.fromMe ? styles.msgOut : styles.msgIn]}>
              <Text style={{ color: item.fromMe ? '#fff' : colors.neutral[800] }}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: colors.neutral[500] }}>Belum ada pesan.</Text>}
        />

        <View style={styles.composer}>
          <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Ketik pesan..." />
          <TouchableOpacity onPress={send} style={styles.sendButton}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
