import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppColors } from '../../../hooks/use-app-colors';

const courses = [
	{ id: '1', kode: 'IF101', nama: 'Pemrograman Web', sks: 3, nilai: 'A' },
	{ id: '2', kode: 'IF102', nama: 'Struktur Data', sks: 3, nilai: 'B+' },
	{ id: '3', kode: 'IF103', nama: 'Basis Data', sks: 3, nilai: 'A-' },
];

export default function MataKuliah() {
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
		row: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 6,
		},
		code: {
			fontSize: 14,
			fontWeight: '700',
			color: colors.primary[700],
		},
		sks: {
			fontSize: 12,
			color: colors.neutral[600],
		},
		name: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text.primary,
		},
		grade: {
			marginTop: 6,
			fontSize: 13,
			color: colors.neutral[600],
		},
		empty: {
			textAlign: 'center',
			color: colors.neutral[500],
			marginTop: 20,
		},
	});

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Daftar Mata Kuliah</Text>

			<FlatList
				data={courses}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<View style={styles.row}>
							<Text style={styles.code}>{item.kode}</Text>
							<Text style={styles.sks}>{item.sks} SKS</Text>
						</View>
						<Text style={styles.name}>{item.nama}</Text>
						<Text style={styles.grade}>Nilai: {item.nilai}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={styles.empty}>Belum ada mata kuliah.</Text>}
			/>
		</View>
	);
}
