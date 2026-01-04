import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppColors } from '../../../hooks/use-app-colors';

const sampleSchedule = [
	{ id: '1', hari: 'Senin', jam: '08:00 - 10:00', mataKuliah: 'Pemrograman Web', ruang: 'R.101', dosen: 'Dr. Ahmad' },
	{ id: '2', hari: 'Selasa', jam: '10:00 - 12:00', mataKuliah: 'Struktur Data', ruang: 'R.202', dosen: 'Bu Siti' },
	{ id: '3', hari: 'Rabu', jam: '13:00 - 15:00', mataKuliah: 'Basis Data', ruang: 'R.303', dosen: 'Pak Budi' },
];

export default function Jadwal() {
  const colors = useAppColors();
	const styles = StyleSheet.create({
		container: {
			flex: 1,
			padding: 16,
			backgroundColor: colors.surface.secondary,
		},
		title: {
			fontSize: 20,
			fontWeight: '700',
			color: colors.primary[800],
			marginBottom: 12,
		},
		list: { paddingBottom: 24 },
		card: {
			backgroundColor: colors.surface.card,
			padding: 14,
			borderRadius: 12,
			marginBottom: 12,
			borderWidth: 1,
			borderColor: colors.border.DEFAULT,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.06,
			shadowRadius: 12,
			elevation: 3,
			flexDirection: 'row',
			alignItems: 'center',
		},
		cardLeftBadge: {
			width: 56,
			height: 56,
			borderRadius: 10,
			backgroundColor: colors.primary[600],
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: 12,
		},
		dayText: { color: '#fff', fontWeight: '800', fontSize: 12 },
		cardContent: { flex: 1 },
		metaRow: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'center' },
		course: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
		room: { fontSize: 12, color: colors.neutral[600] },
		chip: { backgroundColor: colors.accent[50], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
		chipText: { color: colors.accent[700], fontSize: 12, fontWeight: '600' },
		chipOutline: { borderWidth: 1, borderColor: colors.neutral[200], paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
		chipOutlineText: { color: colors.neutral[600], fontSize: 12 },
		meta: { fontSize: 13, color: colors.neutral[500] },
		lecturer: { marginTop: 6, fontSize: 13, color: colors.neutral[600] },
		empty: { textAlign: 'center', color: colors.neutral[500], marginTop: 20 },
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Jadwal Perkuliahan</Text>

			<FlatList
				data={sampleSchedule}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
					renderItem={({ item }) => (
						<View style={styles.card}>
							<View style={styles.cardLeftBadge}>
								<Text style={styles.dayText}>{item.hari.slice(0,3).toUpperCase()}</Text>
							</View>
							<View style={styles.cardContent}>
								<Text style={styles.course}>{item.mataKuliah}</Text>
								<View style={styles.metaRow}>
									<View style={styles.chip}><Text style={styles.chipText}>{item.jam}</Text></View>
									<View style={styles.chipOutline}><Text style={styles.chipOutlineText}>{item.ruang}</Text></View>
								</View>
								<Text style={styles.lecturer}>Dosen: {item.dosen}</Text>
							</View>
						</View>
					)}
				ListEmptyComponent={<Text style={styles.empty}>Belum ada jadwal.</Text>}
			/>
		</View>
	);
}


