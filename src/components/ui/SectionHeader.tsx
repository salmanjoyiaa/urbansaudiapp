import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors, spacing, typography } from '@/theme';

interface SectionHeaderProps {
  /** Section title (displayed uppercase) */
  title: string;
  /** Optional action label on the right */
  actionLabel?: string;
  /** Action handler */
  onAction?: () => void;
  /** Container style override */
  style?: ViewStyle;
}

/**
 * Section header with title and optional right-side action link.
 *
 * Usage:
 * ```tsx
 * <SectionHeader title="Recent Activity" actionLabel="View all" onAction={goToAll} />
 * ```
 */
export function SectionHeader({ title, actionLabel, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (
        <PressableScale onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.label,
    color: colors.textMuted,
  },
  action: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
});
