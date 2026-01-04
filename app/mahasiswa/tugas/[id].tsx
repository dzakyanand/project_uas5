import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../components/common/Button';
import { useAppColors } from '../../../hooks/use-app-colors';
import Dropdown from '../../../components/common/Dropdown';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

export default function TaskDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useAppColors();
  const [task, setTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const taskId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('tasks');
        const tasks = raw ? JSON.parse(raw) : [];
        console.log('Loaded tasks:', tasks);
        console.log('Looking for ID:', taskId);
        const found = tasks.find((t: any) => t.id === taskId);
        console.log('Found task:', found);
        setTask(found || null);
        if (found) {
          setEditForm(JSON.parse(JSON.stringify(found)));
        }
      } catch (err) {
        console.error('Load error:', err);
        Alert.alert('Error', 'Gagal memuat tugas');
      }
    };
    load();
  }, [taskId]);

  const toggleDone = async () => {
    const raw = await AsyncStorage.getItem('tasks');
    const tasks = raw ? JSON.parse(raw) : [];
    const updated = tasks.map((t: any) => t.id === taskId ? { ...t, status: t.status === 'selesai' ? 'belum' : 'selesai' } : t);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    setTask({ ...task, status: task.status === 'selesai' ? 'belum' : 'selesai' });
  };

  const handleSaveEdit = async () => {
    if (!editForm.judul?.trim()) {
      Alert.alert('Error', 'Judul tidak boleh kosong');
      return;
    }
    
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('tasks');
      const tasks = raw ? JSON.parse(raw) : [];
      const updated = tasks.map((t: any) => t.id === taskId ? editForm : t);
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
      setTask(editForm);
      setIsEditing(false);
      Alert.alert('Sukses', 'Tugas berhasil diperbarui');
    } catch (err) {
      Alert.alert('Error', 'Gagal memperbarui tugas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    const confirmDelete = async () => {
      try {
        console.log('DELETE - taskId:', taskId);
        
        const raw = await AsyncStorage.getItem('tasks');
        const allTasks: any[] = raw ? JSON.parse(raw) : [];
        console.log('Before:', allTasks.length);
        
        const filtered = allTasks.filter(t => t.id !== taskId);
        console.log('After:', filtered.length);
        
        await AsyncStorage.setItem('tasks', JSON.stringify(filtered));
        console.log('Saved');
        
        if (typeof window !== 'undefined') {
          alert('Tugas dihapus');
          window.location.href = '/mahasiswa/tugas';
        } else {
          Alert.alert('Berhasil', 'Tugas dihapus', [
            {
              text: 'OK',
              onPress: () => router.replace('/mahasiswa/tugas')
            }
          ]);
        }
      } catch (err) {
        console.error('ERROR:', err);
        if (typeof window === 'undefined') {
          Alert.alert('Error', String(err));
        } else {
          alert('Error: ' + String(err));
        }
      }
    };

    if (typeof window !== 'undefined') {
      // Web
      if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        confirmDelete();
      }
    } else {
      // Native
      Alert.alert('Hapus Tugas', 'Apakah Anda yakin ingin menghapus tugas ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: confirmDelete }
      ]);
    }
  };

  const webDatePicker = () => {
    return new Promise<string | null>((resolve) => {
      if (typeof document === 'undefined') return resolve(null);
      try {
        const input = document.createElement('input');
        input.type = 'date';
        input.value = editForm.deadline || '';
        input.style.display = 'none';
        document.body.appendChild(input);
        input.onchange = () => {
          const val = input.value;
          document.body.removeChild(input);
          resolve(val);
        };
        input.click();
      } catch (e) {
        resolve(null);
      }
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.surface.primary },
    empty: { color: colors.neutral[500] },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    backButton: { 
      padding: 8, 
      borderRadius: 8, 
      backgroundColor: colors.primary[600],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    titleWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: '700', color: colors.text.primary, flex: 1 },
    meta: { color: colors.text.secondary, marginBottom: 12 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: colors.primary[100], marginBottom: 12 },
    statusText: { fontWeight: '600', color: colors.primary[700], fontSize: 12 },
    buttonGroup: { gap: 8, marginTop: 20 },
    editButton: { 
      paddingHorizontal: 12, 
      paddingVertical: 8, 
      backgroundColor: colors.primary[600], 
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    card: { backgroundColor: colors.surface.card, padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border.DEFAULT },
    label: { fontSize: 12, color: colors.text.secondary, fontWeight: '600', marginBottom: 6 },
    value: { fontSize: 14, color: colors.text.primary, marginBottom: 12 },
    input: { borderWidth: 1, borderColor: colors.border.DEFAULT, borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: colors.surface.primary, color: colors.text.primary },
    dropdownContainer: { marginBottom: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: colors.surface.primary, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text.primary },
    closeButton: { padding: 8 },
    dateButton: { borderWidth: 1, borderColor: colors.border.DEFAULT, borderRadius: 8, padding: 12, marginBottom: 12, backgroundColor: colors.surface.primary },
    dateButtonText: { color: colors.text.primary },
  });

  if (!task) return <View style={styles.container}><Text style={styles.empty}>Tugas tidak ditemukan.</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{task.judul}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsEditing(true)}
          style={styles.editButton}
        >
          <Icon name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Mata Kuliah</Text>
        <Text style={styles.value}>{task.mataKuliah || '-'}</Text>
        
        <Text style={styles.label}>Deadline</Text>
        <Text style={styles.value}>{task.deadline || '-'}</Text>
        
        <Text style={styles.label}>Prioritas</Text>
        <Text style={styles.value}>{task.prioritas ? task.prioritas.charAt(0).toUpperCase() + task.prioritas.slice(1) : '-'}</Text>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>
          Status: {task.status === 'selesai' ? '✓ Selesai' : task.status === 'dikerjakan' ? '⏳ Dikerjakan' : '○ Belum'}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button 
          title={task.status === 'selesai' ? 'Tandai Belum Selesai' : 'Tandai Selesai'} 
          onPress={toggleDone} 
        />
        <Button title="Hapus Tugas" onPress={remove} variant="outline" />
      </View>

      {/* Edit Modal */}
      <Modal visible={isEditing} animationType="slide" transparent onRequestClose={() => setIsEditing(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Tugas</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeButton}>
                <Icon name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Judul Tugas"
              placeholderTextColor={colors.text.secondary}
              value={editForm.judul || ''}
              onChangeText={(val) => setEditForm({ ...editForm, judul: val })}
            />

            <Dropdown
              label="Mata Kuliah"
              options={[
                { label: 'Pemrograman Web', value: 'Pemrograman Web' },
                { label: 'Struktur Data', value: 'Struktur Data' },
                { label: 'Basis Data', value: 'Basis Data' },
                { label: 'Algoritma', value: 'Algoritma' },
              ]}
              selectedValue={editForm.mataKuliah || ''}
              onValueChange={(val) => setEditForm({ ...editForm, mataKuliah: val })}
              placeholder="Pilih mata kuliah"
            />

            <TouchableOpacity 
              style={styles.dateButton}
              onPress={async () => {
                if (Platform.OS === 'web') {
                  const val = await webDatePicker();
                  if (val) setEditForm({ ...editForm, deadline: val });
                } else {
                  setShowDatePicker(true);
                }
              }}
            >
              <Text style={styles.dateButtonText}>
                Deadline: {editForm.deadline || 'Pilih tanggal'}
              </Text>
            </TouchableOpacity>

            <Dropdown
              label="Prioritas"
              options={[
                { label: 'Tinggi', value: 'tinggi' },
                { label: 'Sedang', value: 'sedang' },
                { label: 'Rendah', value: 'rendah' },
              ]}
              selectedValue={editForm.prioritas || ''}
              onValueChange={(val) => setEditForm({ ...editForm, prioritas: val })}
              placeholder="Pilih prioritas"
            />

            <Dropdown
              label="Status"
              options={[
                { label: 'Belum', value: 'belum' },
                { label: 'Dikerjakan', value: 'dikerjakan' },
                { label: 'Selesai', value: 'selesai' },
              ]}
              selectedValue={editForm.status || 'belum'}
              onValueChange={(val) => setEditForm({ ...editForm, status: val })}
              placeholder="Pilih status"
            />

            <View style={{ gap: 8, marginTop: 16 }}>
              <Button 
                title="Simpan Perubahan" 
                onPress={handleSaveEdit}
                loading={loading}
              />
              <Button 
                title="Batal" 
                variant="outline"
                onPress={() => setIsEditing(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      {Platform.OS !== 'web' && (
        <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pilih Tanggal</Text>
              <View style={{ gap: 8, marginTop: 16 }}>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() - 1);
                    setEditForm({ ...editForm, deadline: d.toISOString().slice(0, 10) });
                  }}
                >
                  <Text style={styles.dateButtonText}>-1 Hari</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setEditForm({ ...editForm, deadline: new Date().toISOString().slice(0, 10) })}
                >
                  <Text style={styles.dateButtonText}>Hari Ini</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    setEditForm({ ...editForm, deadline: d.toISOString().slice(0, 10) });
                  }}
                >
                  <Text style={styles.dateButtonText}>+1 Hari</Text>
                </TouchableOpacity>

                <Button 
                  title="Selesai" 
                  onPress={() => setShowDatePicker(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
