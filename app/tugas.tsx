import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type Task = { id: string; title: string; desc?: string };
const STORAGE_KEY = 'minisiakad_tasks_v1';

export default function TugasPage() {
  const { isDarkMode } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.error('load tasks', e);
    } finally { setLoading(false); }
  };

  const saveAll = async (next: Task[]) => {
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) { console.error('save tasks', e); }
    setTasks(next);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setTitle(''); setDesc(''); setModalVisible(true); };
  const openEdit = (t: Task) => { setEditing(t); setTitle(t.title); setDesc(t.desc || ''); setModalVisible(true); };

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Validation', 'Judul harus diisi'); return; }
    if (editing) {
      const next = tasks.map((t) => t.id === editing.id ? { ...t, title: title.trim(), desc } : t);
      await saveAll(next);
    } else {
      const newTask: Task = { id: String(Date.now()), title: title.trim(), desc };
      await saveAll([newTask, ...tasks]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Tugas', 'Yakin hapus tugas ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => { await saveAll(tasks.filter(t => t.id !== id)); } }
    ]);
  };

  return (
    <View style={isDarkMode ? {...styles.container, ...styles.dark} : styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tugas Saya</Text>
        <TouchableOpacity onPress={openAdd} style={styles.addBtn}>
          <Icon name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (<Text>Loading...</Text>) : (
        <FlatList
          data={tasks}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View style={styles.taskRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                {item.desc ? <Text style={styles.taskDesc}>{item.desc}</Text> : null}
              </View>

              <View style={styles.taskActions}>
                <TouchableOpacity onPress={() => openEdit(item)} style={styles.iconBtn}><Icon name="pencil" size={18} color="#374151" /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconBtn}><Icon name="delete" size={18} color="#ef4444" /></TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (<Text style={{ color: '#6b7280' }}>Belum ada tugas. Tambah tugas baru.</Text>)}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? 'Edit Tugas' : 'Tambah Tugas'}</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Judul" style={styles.input} />
            <TextInput value={desc} onChangeText={setDesc} placeholder="Deskripsi (opsional)" style={[styles.input, { height: 90 }]} multiline />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtn}><Text>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.modalBtn, styles.modalBtnPrimary]}><Text style={{ color: '#fff' }}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  dark: { backgroundColor: '#0b1220' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  addBtn: { backgroundColor: '#2563eb', padding: 10, borderRadius: 8 },
  taskRow: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f8fafc', borderRadius: 8, marginBottom: 8 },
  taskTitle: { fontWeight: '700' },
  taskDesc: { color: '#6b7280' },
  taskActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 8 },
  modalWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: { width: '92%', maxWidth: 520, backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 10, marginBottom: 8 },
  modalBtn: { padding: 10, borderRadius: 8 },
  modalBtnPrimary: { backgroundColor: '#2563eb' },
});
