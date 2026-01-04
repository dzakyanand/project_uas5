import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAppColors } from '../../hooks/use-app-colors';

export default function Navbar() {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const pathname = usePathname();
  const colors = useAppColors();

  const items = [
    { key: 'home', label: 'Beranda', icon: 'home-outline', screen: '/mahasiswa' },
    { key: 'akademik', label: 'Akademik', icon: 'school-outline', screen: '/mahasiswa/akademik/khs' },
    { key: 'perkuliahan', label: 'Kuliah', icon: 'calendar-outline', screen: '/mahasiswa/perkuliahan/jadwal' },
    { key: 'tugas', label: 'Tugas', icon: 'clipboard-text-outline', screen: '/mahasiswa/tugas' },
    { key: 'pesan', label: 'Pesan', icon: 'message-outline', screen: '/mahasiswa/pesan' },
  ];

  const theme = {
    bg: colors.surface.primary,
    border: colors.border.DEFAULT,
    activeIndicator: colors.primary[600],
    activeBg: 'rgba(99, 102, 241, 0.12)',
    activeText: colors.primary[600],
    inactiveText: colors.neutral[500],
    profileBg: colors.surface.tertiary,
    profileText: colors.text.primary,
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: isDarkMode ? 0.3 : 0.08,
              shadowRadius: 12,
            },
            android: {
              elevation: 12,
            },
          }),
        },
      ]}
    >
      {/* Navigation Items */}
      <View style={styles.items}>
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.screen as string);
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.itemWrapper}
              onPress={() => router.replace(item.screen as any)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.item,
                  isActive && {
                    backgroundColor: theme.activeBg,
                  },
                ]}
              >
                {/* Active Indicator */}
                {isActive && (
                  <View
                    style={[
                      styles.activeIndicator,
                      { backgroundColor: theme.activeIndicator },
                    ]}
                  />
                )}

                <Icon
                  name={item.icon as any}
                  size={24}
                  color={isActive ? theme.activeText : theme.inactiveText}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: isActive ? theme.activeText : theme.inactiveText,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Profile Section */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => router.push(user ? '/mahasiswa/profile' : '/login')}
        activeOpacity={0.7}
      >
        <View style={styles.profileContainer}>
          {/* Avatar with Gradient Effect */}
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: isDarkMode ? '#6366F1' : '#6366F1',
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={styles.avatarText}>
              {user?.nama
                ? user.nama
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()
                : 'U'}
            </Text>
            {/* Online Indicator */}
            <View style={styles.onlineIndicator} />
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <Text
              style={[styles.profileName, { color: theme.profileText }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user?.nama ?? 'Profile'}
            </Text>
            <Text
              style={[styles.profileRole, { color: theme.inactiveText }]}
              numberOfLines={1}
            >
              Mahasiswa
            </Text>
          </View>

          {/* Chevron Icon */}
          <Icon
            name="chevron-right"
            size={20}
            color={theme.inactiveText}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>

      {/* Theme Toggle */}
      <TouchableOpacity
        style={[
          styles.themeToggle,
          {
            backgroundColor: theme.profileBg,
            borderColor: theme.border,
          },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Icon
          name={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={20}
          color={isDarkMode ? '#F59E0B' : '#6366F1'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  items: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    position: 'relative',
    minWidth: 70,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -15 }],
    width: 30,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  profileSection: {
    marginLeft: 12,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.06)',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 160,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 4,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    borderWidth: 1,
  },
});