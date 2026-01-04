import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../components/common/Button';
import { ThemedText } from '../../../components/themed-text';
import { useAppColors } from '../../../hooks/use-app-colors';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

interface Task {
  id: string;
  judul: string;
  mataKuliah: string;
  deadline: string;
  status: 'belum' | 'dikerjakan' | 'selesai';
  prioritas?: 'tinggi' | 'sedang' | 'rendah';
}

export default function TugasList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const colors = useAppColors();

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: colors.surface.primary },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    empty: { textAlign: 'center', marginTop: 32, color: colors.neutral[500] },
    card: {
      backgroundColor: colors.surface.card,
      padding: 14,
      borderRadius: 12,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    cardLeft: { flex: 1, paddingRight: 8 },
    title: { fontSize: 16, fontWeight: '700', color: colors.text.primary },
    meta: { fontSize: 12, color: colors.text.secondary, marginTop: 6 },
    prio: { marginTop: 6, fontSize: 12, color: colors.text.secondary, fontStyle: 'italic' },
    badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, minWidth: 72, alignItems: 'center' },
    badgeText: { color: '#fff', fontWeight: '700', fontSize: 12, textTransform: 'capitalize' },
    overdue: { marginTop: 6, fontSize: 12, color: colors.error[600], fontWeight: '700' },
    actionButtons: { flexDirection: 'row', gap: 8, marginLeft: 8 },
    actionButton: { padding: 6, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    deleteButton: { backgroundColor: colors.error[100] },
    editButton: { backgroundColor: colors.primary[100] },
  });

  const formatDate = (d?: string) => {
    if (!d) return 'Tanpa deadline';
    // accept YYYY-MM-DD or ISO
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let date: Date;
    if (m) date = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`);
    else date = new Date(d);
    if (isNaN(date.getTime())) return d;
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${String(date.getDate()).padStart(2,'0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const isOverdue = (d?: string) => {
    if (!d) return false;
    const m = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const date = m ? new Date(`${m[1]}-${m[2]}-${m[3]}T23:59:59`) : new Date(d);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(23,59,59,999);
    return date < today;
  };

  const loadTasks = async () => {
    try {
      const raw = await AsyncStorage.getItem('tasks');
      if (raw) setTasks(JSON.parse(raw));
    } catch (err) {
      console.error('Load tasks error:', err);
    }
  };

  const deleteTask = (id: string, judul: string) => {
    // For web use window.confirm, for native use Alert.alert
    const confirmDelete = async () => {
      try {
        console.log('DELETE - ID:', id);
        
        const raw = await AsyncStorage.getItem('tasks');
        const allTasks: Task[] = raw ? JSON.parse(raw) : [];
        console.log('Before:', allTasks.length);
        
        const updated = allTasks.filter(t => t.id !== id);
        console.log('After:', updated.length);
        
        await AsyncStorage.setItem('tasks', JSON.stringify(updated));
        console.log('Saved');
        
        setTasks(updated);
        
        if (typeof window !== 'undefined') {
          alert('Tugas dihapus');
          window.location.reload();
        } else {
          Alert.alert('Berhasil', 'Tugas dihapus');
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
      if (window.confirm(`Hapus "${judul}"?`)) {
        confirmDelete();
      }
    } else {
      // Native
      Alert.alert('Hapus Tugas', `Hapus "${judul}"?`, [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: confirmDelete
        }
      ]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [])
  );

  useEffect(() => {
    loadTasks();
  }, []);

  const openTask = (id: string) => router.push(`/mahasiswa/tugas/${id}`);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Tugas</ThemedText>
        <Button title="Tambah" onPress={() => router.push('/mahasiswa/tugas/tambah')} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada tugas.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardLeft} onPress={() => openTask(item.id)}>
              <Text style={styles.title}>{item.judul}</Text>
              <Text style={styles.meta}>{item.mataKuliah} • {formatDate(item.deadline)}</Text>
              {item.deadline && isOverdue(item.deadline) ? <Text style={styles.overdue}>Telat</Text> : null}
              {item.prioritas ? <Text style={styles.prio}>Prioritas: {item.prioritas}</Text> : null}
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={[styles.badge, { backgroundColor: item.status === 'selesai' ? colors.success[600] : item.status === 'dikerjakan' ? colors.accent[500] : '#F59E0B' }]}> 
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => openTask(item.id)}
                >
                  <Icon name="pencil" size={16} color={colors.primary[600]} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deleteTask(item.id, item.judul)}
                >
                  <Icon name="trash-can" size={16} color={colors.error[600]} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}


