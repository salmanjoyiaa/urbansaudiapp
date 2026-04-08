import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/theme';
import { PressableScale } from './PressableScale';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated';
  /** If provided, card becomes pressable with scale feedback */
  onPress?: () => void;
  /** Optional header content */
  header?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
}

/**
 * Surface card with optional header, footer, and pressable variant.
 * Uses ambient shadow for subtle depth.
 */
export function Card({ children, style, variant = 'default', onPress, header, footer }: CardProps) {
  const cardContent = (
    <View style={[styles.card, variant === 'elevated' && styles.elevated, style]}>
      {header && (
        <>
          <View style={styles.header}>{header}</View>
          <View style={styles.divider} />
        </>
      )}
      <View style={styles.body}>{children}</View>
      {footer && (
        <>
          <View style={styles.divider} />
          <View style={styles.footer}>{footer}</View>
        </>
      )}
    </View>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress}>
        {cardContent}
      </PressableScale>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.soft,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    ...shadows.medium,
  },
  header: {
    padding: spacing.base,
  },
  body: {
    padding: spacing.base,
  },
  footer: {
    padding: spacing.base,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.base,
  },
});
