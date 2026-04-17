export const COLORS = {
  primary: '#007AFF', // Vibrant Blue
  secondary: '#5856D6',
  background: '#F8F9FB', // Softer background
  surface: '#FFFFFF',
  text: '#1A1A1E', // Deeper text
  textSecondary: '#4A4A4E',
  textTertiary: '#9DA3B0',
  border: '#EBEFF5',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  white: '#FFFFFF',
  placeholder: '#F0F2F5',
  shadow: '#000000',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  bodySecondary: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  label: {
    fontSize: 12,
    fontWeight: '800' as const,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  }
};

