/** Premium dark-first color palette for UrbanSaudi Admin */
export const colors = {
  // Core
  background: '#0A1628',
  surface: '#111D31',
  surfaceElevated: '#162440',
  card: '#1A2A47',
  cardHover: '#1F3155',

  // Brand
  primary: '#D4A853',
  primaryMuted: '#B8923F',
  primaryLight: 'rgba(212, 168, 83, 0.15)',

  // Text
  textPrimary: '#F5F5F7',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textInverse: '#0A1628',

  // Borders
  border: '#1E3356',
  borderLight: '#253D63',
  borderFocus: '#D4A853',

  // Status colors (matching web app)
  status: {
    pending: { bg: 'rgba(245, 158, 11, 0.12)', text: '#FBBF24', border: '#92400E' },
    assigned: { bg: 'rgba(59, 130, 246, 0.12)', text: '#60A5FA', border: '#1E40AF' },
    confirmed: { bg: 'rgba(16, 185, 129, 0.12)', text: '#34D399', border: '#065F46' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.12)', text: '#F87171', border: '#991B1B' },
    completed: { bg: 'rgba(139, 92, 246, 0.12)', text: '#A78BFA', border: '#5B21B6' },
  },

  // Semantic
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#60A5FA',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  shimmer: '#253D63',
} as const;

export type StatusKey = keyof typeof colors.status;
