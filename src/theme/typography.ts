import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography: Record<string, TextStyle> = {
  h1: { fontFamily, fontSize: 28, fontWeight: '700', lineHeight: 34, letterSpacing: -0.5 },
  h2: { fontFamily, fontSize: 22, fontWeight: '700', lineHeight: 28, letterSpacing: -0.3 },
  h3: { fontFamily, fontSize: 18, fontWeight: '600', lineHeight: 24 },
  subtitle: { fontFamily, fontSize: 16, fontWeight: '600', lineHeight: 22 },
  body: { fontFamily, fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontFamily, fontSize: 13, fontWeight: '400', lineHeight: 18 },
  caption: { fontFamily, fontSize: 12, fontWeight: '500', lineHeight: 16, letterSpacing: 0.2 },
  label: { fontFamily, fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.5, textTransform: 'uppercase' },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }), fontSize: 12, fontWeight: '400', lineHeight: 16 },
} as const;
