/**
 * "Midnight Concierge" color palette for UrbanRealEstateSaudi
 *
 * Design direction: Deep midnight-navy base, warm amber accent,
 * crisp white surfaces. Inspired by Linear.app precision + Stripe trust.
 *
 * OWASP note: No credentials or secrets in theme files.
 */
export const colors = {
  // ── Surfaces (Tonal Layering) ──
  background: '#F7F5F0',          // warm off-white parchment
  surface: '#EFEDE8',             // surface-container-low
  surfaceElevated: '#FFFFFF',     // interactive cards / popovers
  card: '#FFFFFF',                // card background
  cardHover: '#F2F0EB',           // pressed / hovered card

  // ── Brand ──
  primary: '#021540',             // midnight blue — anchor
  primaryMuted: '#1a2b55',        // gradient end / hover
  primaryLight: 'rgba(2, 21, 64, 0.06)',
  primaryBorder: 'rgba(2, 21, 64, 0.15)',

  // Warm Amber accent — luxury Saudi real estate feel
  accent: '#D4A853',              // warm amber — primary accent
  accentLight: 'rgba(212, 168, 83, 0.10)',
  accentMuted: '#B8923F',         // darker amber for text-on-amber-bg
  accentDark: '#9A7A2E',          // pressed state

  // Keep secondary for backwards-compat
  secondary: '#D4A853',
  secondaryLight: 'rgba(212, 168, 83, 0.10)',

  // ── Text ──
  textPrimary: '#0A0F1E',         // near-black midnight
  textSecondary: '#5A6070',       // on-surface-variant
  textMuted: '#8D919F',           // disabled / placeholder
  textInverse: '#FFFFFF',         // on filled buttons

  // ── Borders (Ghost Border rule: max 15% opacity) ──
  border: 'rgba(10, 15, 30, 0.08)',
  borderLight: 'rgba(10, 15, 30, 0.04)',
  borderFocus: '#D4A853',

  // ── Status (low-sat bg + high-sat text — anti-traffic-light) ──
  status: {
    pending:   { bg: 'rgba(245, 158, 11, 0.08)', text: '#b27d10', border: 'rgba(245, 158, 11, 0.15)' },
    assigned:  { bg: 'rgba(59, 130, 246, 0.08)', text: '#2563EB', border: 'rgba(59, 130, 246, 0.15)' },
    confirmed: { bg: 'rgba(34, 197, 94, 0.08)',  text: '#16A34A', border: 'rgba(34, 197, 94, 0.15)' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.08)',  text: '#DC2626', border: 'rgba(239, 68, 68, 0.15)' },
    completed: { bg: 'rgba(139, 92, 246, 0.08)', text: '#7C3AED', border: 'rgba(139, 92, 246, 0.15)' },
  },

  // ── Categorical Accents (for dashboard stat cards) ──
  category: {
    visits: '#F59E0B',            // amber — pending visits
    properties: '#D4A853',        // brand amber — properties
    propertyAgents: '#E36414',    // burnt orange — property agents
    visitingAgents: '#7C3AED',    // violet — visiting team
    leads: '#EC4899',             // pink — leads
    maintenance: '#0D9488',       // teal — maintenance
    customers: '#021540',         // primary — customers
    active: '#16A34A',            // green — active items
  },

  // ── Semantic ──
  success: '#16A34A',
  error: '#DC2626',
  warning: '#F59E0B',
  info: '#2563EB',
  whatsapp: '#25D366',
  successLight: 'rgba(22, 163, 74, 0.12)',
  errorLight: 'rgba(220, 38, 38, 0.12)',
  warningLight: 'rgba(245, 158, 11, 0.12)',
  infoLight: 'rgba(37, 99, 235, 0.12)',
  whatsappLight: 'rgba(37, 211, 102, 0.12)',

  // ── Overlay & Misc ──
  overlay: 'rgba(2, 21, 64, 0.50)',
  shimmer: '#E8E6E1',

  // ── Gradients ──
  gradient: {
    primaryStart: '#021540',
    primaryEnd: '#1a2b55',
    accentStart: '#D4A853',
    accentEnd: '#B8923F',
  },
} as const;

export function alpha(hexColor: string, opacity: number) {
  const normalized = hexColor.replace('#', '').trim();
  const expanded = normalized.length === 3
    ? normalized.split('').map((character) => character + character).join('')
    : normalized;

  const red = parseInt(expanded.slice(0, 2), 16);
  const green = parseInt(expanded.slice(2, 4), 16);
  const blue = parseInt(expanded.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

/** Ambient shadow preset — soft luxury feel */
export const shadows = {
  soft: {
    shadowColor: '#0A0F1E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0A0F1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  strong: {
    shadowColor: '#0A0F1E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

/** Backwards-compat alias */
export const ambientShadow = shadows.medium;

export type StatusKey = keyof typeof colors.status;
