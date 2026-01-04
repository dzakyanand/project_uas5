import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Dropdown from '../../../components/common/Dropdown';
// lightweight id generator to avoid adding uuid typings
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
import { useAppColors } from '../../../hooks/use-app-colors';

export default function TambahTugas() {
  const router = useRouter();
  const colors = useAppColors();
  const [judul, setJudul] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [deadline, setDeadline] = useState('');
  const [prioritas, setPrioritas] = useState<'tinggi'|'sedang'|'rendah' | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('tasks');
      const tasks = raw ? JSON.parse(raw) : [];
      const newTask = { id: uid(), judul, mataKuliah, deadline, status: 'belum', prioritas };
      const updated = [newTask, ...tasks];
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
      router.replace('/mahasiswa/tugas');
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  const mataKuliahOptions = [
    { label: 'Pemrograman Web', value: 'Pemrograman Web' },
    { label: 'Struktur Data', value: 'Struktur Data' },
    { label: 'Basis Data', value: 'Basis Data' },
    { label: 'Algoritma', value: 'Algoritma' },
  ];

  const prioritasOptions = [
    { label: 'Tinggi', value: 'tinggi' },
    { label: 'Sedang', value: 'sedang' },
    { label: 'Rendah', value: 'rendah' },
  ];

  const webDatePicker = () => {
    return new Promise<string | null>((resolve) => {
      if (typeof document === 'undefined') return resolve(null);
      try {
        const input = document.createElement('input');
        input.type = 'date';
        // Put the input on-screen but invisible so some browsers allow the picker
        input.style.position = 'fixed';
        input.style.left = '50%';
        input.style.top = '50%';
        input.style.opacity = '0';
        input.style.zIndex = '99999';
        input.value = '';
        document.body.appendChild(input);

        const cleanup = () => {
          try { if (input.parentNode) input.parentNode.removeChild(input); } catch (e) {}
          input.onchange = null;
          input.onblur = null;
        };

        input.onchange = () => {
          const v = input.value;
          cleanup();
          resolve(v || null);
        };

        // Some browsers (Safari) support showPicker()
        try {
          const anyInput = input as any;
          if (typeof anyInput.showPicker === 'function') {
            anyInput.showPicker();
            // fallback: if user dismisses, onblur will fire
          } else {
            input.focus();
            input.click();
          }
        } catch (e) {
          // final fallback
          try { input.focus(); input.click(); } catch (e) {}
        }

        // If user clicks away, resolve with current value or null
        input.onblur = () => {
          setTimeout(() => {
            if (document.body.contains(input)) {
              const v = input.value;
              cleanup();
              resolve(v || null);
            }
          }, 150);
        };
      } catch (e) {
        resolve(null);
      }
    });
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.surface.primary },
    pageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12, color: colors.text.primary },
    dateButton: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.neutral[200], marginBottom: 16 },
    dateLabel: { fontSize: 12, color: colors.neutral[600], marginBottom: 6 },
    dateValue: { fontSize: 16, color: colors.neutral[800] },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
    modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
    modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
    modalControls: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    modalBtn: { padding: 8 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
    modalActionCancel: { padding: 10 },
    modalActionConfirm: { padding: 10, backgroundColor: colors.primary[600], borderRadius: 8 },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Tambah Tugas</Text>

      <Input label="Judul" value={judul} onChangeText={setJudul} placeholder="Judul tugas" />

      <Dropdown
        label="Mata Kuliah"
        options={mataKuliahOptions.map(o => ({ label: o.label, value: o.value }))}
        selectedValue={mataKuliah}
        onValueChange={(v) => setMataKuliah(v)}
        placeholder="Pilih mata kuliah"
      />

      <TouchableOpacity style={styles.dateButton} onPress={async () => {
        if (Platform.OS === 'web') {
          const val = await webDatePicker();
          if (val) setDeadline(val);
          return;
        }
        setShowDatePicker(true);
      }}>
        <Text style={styles.dateLabel}>Deadline</Text>
        <Text style={styles.dateValue}>{deadline || 'Pilih tanggal'}</Text>
      </TouchableOpacity>

      <Dropdown
        label="Prioritas"
        options={prioritasOptions.map(o => ({ label: o.label, value: o.value }))}
        selectedValue={prioritas || ''}
        onValueChange={(v) => setPrioritas(v as any)}
        placeholder="Pilih prioritas"
      />

      <Button title="Simpan" onPress={submit} loading={loading} />

      <Modal visible={showDatePicker} transparent animationType="slide" onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pilih Tanggal</Text>
            <View style={styles.modalControls}>
              <TouchableOpacity onPress={() => {
                const d = deadline ? new Date(deadline) : new Date();
                d.setDate(d.getDate() - 1);
                setDeadline(d.toISOString().slice(0,10));
              }} style={styles.modalBtn}><Text>-1 hari</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setDeadline(new Date().toISOString().slice(0,10))} style={styles.modalBtn}><Text>Hari ini</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => {
                const d = deadline ? new Date(deadline) : new Date();
                d.setDate(d.getDate() + 1);
                setDeadline(d.toISOString().slice(0,10));
              }} style={styles.modalBtn}><Text>+1 hari</Text></TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalActionCancel}><Text>Batal</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.modalActionConfirm}><Text style={{ color: '#fff', fontWeight: '700' }}>Pilih</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


