/** 4pt base spacing system */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const borderRadius = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

/** Animation tokens */
export const animation = {
  /** Durations in ms */
  fast: 150,
  normal: 250,
  slow: 400,
  /** Press feedback */
  pressScale: 0.97,
  pressOpacity: 0.85,
} as const;
