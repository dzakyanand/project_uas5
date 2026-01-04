import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppColors } from '../../../hooks/use-app-colors';

const sampleAttendance = [
	{ id: '1', tanggal: '2025-12-01', mataKuliah: 'Pemrograman Web', status: 'Hadir' },
	{ id: '2', tanggal: '2025-12-02', mataKuliah: 'Struktur Data', status: 'Izin' },
	{ id: '3', tanggal: '2025-12-03', mataKuliah: 'Basis Data', status: 'Alpa' },
];

export default function Kehadiran() {
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
		list: {
			paddingBottom: 24,
		},
		card: {
			backgroundColor: colors.surface.card,
			padding: 12,
			borderRadius: 10,
			marginBottom: 12,
			borderWidth: 1,
			borderColor: colors.border.DEFAULT,
		},
		course: {
			fontSize: 16,
			fontWeight: '600',
			color: colors.text.primary,
		},
		meta: {
			fontSize: 13,
			color: colors.neutral[500],
			marginTop: 6,
		},
		empty: {
			textAlign: 'center',
			color: colors.neutral[500],
			marginTop: 20,
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Rekap Kehadiran</Text>

			<FlatList
				data={sampleAttendance}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<Text style={styles.course}>{item.mataKuliah}</Text>
						<Text style={styles.meta}>{item.tanggal} • {item.status}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.empty}>Belum ada data kehadiran.</Text>}
			/>
		</View>
	);
}
