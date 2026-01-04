/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '../constants/theme';
import { useColorScheme } from './use-color-scheme';
import { useTheme } from '../contexts/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Prefer app-level theme setting from ThemeContext; fall back to system
  const { themeMode } = useTheme();
  const system = useColorScheme() ?? 'light';
  const theme = themeMode === 'system' ? system : themeMode;
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
