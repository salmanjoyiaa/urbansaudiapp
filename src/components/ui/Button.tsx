import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              textSizeStyles[size],
              variantTextStyles[variant],
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  disabled: { opacity: 0.5 },
  text: { fontWeight: '600' },
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 36 },
  md: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 44 },
  lg: { paddingHorizontal: spacing.xl, paddingVertical: spacing.base, minHeight: 52 },
};

const textSizeStyles: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.surfaceElevated },
  destructive: { backgroundColor: '#DC2626' },
  ghost: { backgroundColor: 'transparent' },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
};

const variantTextStyles: Record<Variant, TextStyle> = {
  primary: { color: colors.textInverse },
  secondary: { color: colors.textPrimary },
  destructive: { color: '#FFFFFF' },
  ghost: { color: colors.primary },
  outline: { color: colors.textPrimary },
};
