import { Platform, TextStyle } from 'react-native';

/**
 * Typography scale — Outfit (display/headings) + DM Sans (body/UI)
 *
 * Outfit: Geometric, modern, characterful — for app name, hero numbers, section titles
 * DM Sans: Clean, highly legible — for body text, labels, captions
 *
 * Font loading is handled in app/_layout.tsx via expo-font.
 * If fonts haven't loaded yet, fall back to system defaults.
 */

/** Display / heading font */
export const fontDisplay = 'Outfit_700Bold';
export const fontDisplayMedium = 'Outfit_600SemiBold';
export const fontDisplayRegular = 'Outfit_400Regular';

/** Body / UI font */
export const fontBody = 'DMSans_400Regular';
export const fontBodyMedium = 'DMSans_500Medium';
export const fontBodySemiBold = 'DMSans_600SemiBold';
export const fontBodyBold = 'DMSans_700Bold';

/** Fallback system font for pre-load state */
const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

/**
 * Typography tokens.
 * Each heading uses Outfit; body/caption uses DM Sans.
 * Falls back gracefully if fonts aren't loaded yet.
 */
export const typography: Record<string, TextStyle> = {
  // ── Display / Headlines (Outfit) ──
  heroNumber: { fontFamily: fontDisplay, fontSize: 42, fontWeight: '700', lineHeight: 48, letterSpacing: -1.0 },
  h1:         { fontFamily: fontDisplay, fontSize: 30, fontWeight: '700', lineHeight: 38, letterSpacing: -0.6 },
  h2:         { fontFamily: fontDisplay, fontSize: 24, fontWeight: '700', lineHeight: 30, letterSpacing: -0.4 },
  h3:         { fontFamily: fontDisplayMedium, fontSize: 20, fontWeight: '600', lineHeight: 26, letterSpacing: -0.2 },

  // ── Body / UI (DM Sans) ──
  subtitle:   { fontFamily: fontBodySemiBold, fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body:       { fontFamily: fontBody, fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyMedium: { fontFamily: fontBodyMedium, fontSize: 15, fontWeight: '500', lineHeight: 22 },
  bodySmall:  { fontFamily: fontBody, fontSize: 13, fontWeight: '400', lineHeight: 18 },

  // ── Labels & Metadata (DM Sans) ──
  caption:    { fontFamily: fontBodyMedium, fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0.2 },
  label:      { fontFamily: fontBodySemiBold, fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
  labelLarge: { fontFamily: fontBodySemiBold, fontSize: 13, fontWeight: '600', lineHeight: 16, letterSpacing: 0.5, textTransform: 'uppercase' },

  // ── Monospace ──
  mono: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },

  // ── Button text ──
  buttonSm:   { fontFamily: fontBodySemiBold, fontSize: 13, fontWeight: '600', lineHeight: 16 },
  buttonMd:   { fontFamily: fontBodySemiBold, fontSize: 15, fontWeight: '600', lineHeight: 20 },
  buttonLg:   { fontFamily: fontBodyBold, fontSize: 17, fontWeight: '700', lineHeight: 22 },

  // ── Tab bar ──
  tabLabel:   { fontFamily: fontBodySemiBold, fontSize: 11, fontWeight: '600', lineHeight: 14 },
} as const;
