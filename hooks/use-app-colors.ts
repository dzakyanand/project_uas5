import { colors as base } from '../constants/colors';
import { useTheme } from '../contexts/ThemeContext';

export function useAppColors() {
  const { isDarkMode } = useTheme();

  const light = base;

  const dark = {
    ...base,
    surface: {
      primary: '#0A0E1A',
      secondary: '#0F172A',
      tertiary: '#111827',
      elevated: '#141824',
      card: '#141824',
      modal: '#0F172A',
    },
    border: {
      ...base.border,
      DEFAULT: '#1F2937',
      dark: '#4B5563',
    },
    text: {
      ...base.text,
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
      inverted: '#FFFFFF',
    },
    neutral: {
      ...base.neutral,
      0: '#0B1220',
      50: '#071127',
      100: '#0b1220',
      900: '#EDEFF2',
    },
  } as const;

  return isDarkMode ? dark : light;
}
