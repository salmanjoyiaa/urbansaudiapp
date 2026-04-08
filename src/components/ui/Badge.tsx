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
  /** Show a colored dot indicator before label */
  dot?: boolean;
  style?: ViewStyle;
}

/**
 * Semantic badge/chip with status-aware colors and optional dot indicator.
 * Used for visit status, agent status, role labels, etc.
 */
export function Badge({ label, status, color, size = 'md', dot = false, style }: BadgeProps) {
  const c = color || (status ? getStatusColors(status) : { bg: colors.surface, text: colors.textSecondary, border: colors.border });

  return (
    <View style={[styles.badge, size === 'sm' && styles.sm, { backgroundColor: c.bg, borderColor: c.border }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: c.text }]} />}
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 11,
  },
});
