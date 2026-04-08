import React from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'secondary' | 'destructive' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Premium button with PressableScale micro-interaction.
 * Variants: primary (midnight blue), secondary (surface), destructive/danger (red), ghost, outline.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  // Normalize 'danger' → 'destructive'
  const resolvedVariant = variant === 'danger' ? 'destructive' : variant;

  return (
    <PressableScale
      onPress={onPress}
      disabled={isDisabled}
      activeScale={0.97}
      activeOpacity={isDisabled ? 1 : 0.85}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[resolvedVariant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            resolvedVariant === 'primary' || resolvedVariant === 'destructive'
              ? colors.textInverse
              : colors.primary
          }
        />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              textSizeStyles[size],
              variantTextStyles[resolvedVariant],
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.5 },
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
  md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 44 },
  lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.base, minHeight: 52, borderRadius: borderRadius.lg },
};

const textSizeStyles: Record<Size, TextStyle> = {
  sm: { ...typography.buttonSm },
  md: { ...typography.buttonMd },
  lg: { ...typography.buttonLg },
};

/** Primary uses midnight blue fill; accent for secondary hover/focus states */
const variantStyles: Record<Exclude<Variant, 'danger'>, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surface },
  destructive: { backgroundColor: colors.error },
  ghost: { backgroundColor: 'transparent' },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.border },
};

const variantTextStyles: Record<Exclude<Variant, 'danger'>, TextStyle> = {
  primary: { color: colors.textInverse },
  secondary: { color: colors.textPrimary },
  destructive: { color: colors.textInverse },
  ghost: { color: colors.accent },
  outline: { color: colors.textPrimary },
};
