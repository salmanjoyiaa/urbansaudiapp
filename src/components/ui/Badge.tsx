import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';
import type { VisitStatus } from '@/types';
import { getStatusColors } from '@/utils/constants';

interface BadgeProps {
  label: string;
  status?: VisitStatus;
  color?: { bg: string; text: string; border: string };
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, status, color, size = 'md', style }: BadgeProps) {
  const c = color || (status ? getStatusColors(status) : { bg: colors.surfaceElevated, text: colors.textSecondary, border: colors.border });

  return (
    <View style={[styles.badge, size === 'sm' && styles.sm, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  textSm: {
    fontSize: 11,
  },
});
