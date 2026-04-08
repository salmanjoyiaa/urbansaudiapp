import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, animation } from '@/theme';
import { PressableScale } from './PressableScale';

interface AppEmptyStateProps {
  /** Icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Primary heading */
  title: string;
  /** Supporting description */
  subtitle?: string;
  /** Optional call-to-action button */
  actionLabel?: string;
  /** Action button handler */
  onAction?: () => void;
  /** Container style override */
  style?: ViewStyle;
}

/**
 * Branded empty state with icon, text, optional CTA, and fade-in animation.
 *
 * Usage:
 * ```tsx
 * <AppEmptyState
 *   icon="calendar-outline"
 *   title="No visits scheduled"
 *   subtitle="Check back later or adjust your filters."
 *   actionLabel="View all dates"
 *   onAction={() => resetFilter()}
 * />
 * ```
 */
export function AppEmptyState({
  icon = 'folder-open-outline',
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}: AppEmptyStateProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: animation.slow,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: animation.slow,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
        style,
      ]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={colors.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <PressableScale onPress={onAction} style={styles.actionButton}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </PressableScale>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
  },
  actionButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 9999,
    backgroundColor: colors.accentLight,
  },
  actionText: {
    ...typography.bodyMedium,
    color: colors.accent,
    fontSize: 14,
  },
});
