import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: '#6B46C1',      // Púrpura principal
  secondary: '#8B5CF6',    // Púrpura claro
  background: '#F8FAFC',   // Fondo claro
  surface: '#FFFFFF',      // Superficie de tarjetas
  text: '#1E293B',         // Texto principal
  textSecondary: '#64748B', // Texto secundario
  error: '#EF4444',        // Error
  success: '#10B981',      // Éxito
  warning: '#F59E0B',      // Advertencia
  border: '#E2E8F0',       // Bordes
  white: '#FFFFFF',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray300: '#CBD5E1',
  gray400: '#94A3B8',
  gray500: '#64748B',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1E293B',
  gray900: '#0F172A',
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.text,
    outline: colors.border,
  },
};