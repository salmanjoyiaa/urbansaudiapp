import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
  ViewStyle,
} from 'react-native';
import { colors, spacing, borderRadius, typography, animation } from '@/theme';

interface AppInputProps extends Omit<TextInputProps, 'style'> {
  /** Label displayed above the input */
  label: string;
  /** Error message — shows in red below input */
  error?: string;
  /** Leading icon (left side) */
  leadingIcon?: React.ReactNode;
  /** Trailing icon (right side) */
  trailingIcon?: React.ReactNode;
  /** Container style override */
  containerStyle?: ViewStyle;
}

/**
 * Premium text input with label, error state, icon support, and focus ring.
 *
 * Usage:
 * ```tsx
 * <AppInput
 *   label="EMAIL ADDRESS"
 *   value={email}
 *   onChangeText={setEmail}
 *   error={emailError}
 *   leadingIcon={<Ionicons name="mail-outline" size={18} color={colors.textMuted} />}
 * />
 * ```
 */
export function AppInput({
  label,
  error,
  leadingIcon,
  trailingIcon,
  containerStyle,
  onFocus,
  onBlur,
  ...textInputProps
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: animation.fast,
      useNativeDriver: false,
    }).start();
  }, [isFocused, focusAnim]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.error : (colors.border as string),
      error ? colors.error : colors.borderFocus,
    ],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, error && styles.labelError]}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor },
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {leadingIcon && <View style={styles.iconLeft}>{leadingIcon}</View>}
        <TextInput
          {...textInputProps}
          style={[
            styles.input,
            leadingIcon ? styles.inputWithLeading : null,
            trailingIcon ? styles.inputWithTrailing : null,
          ]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
        />
        {trailingIcon && <View style={styles.iconRight}>{trailingIcon}</View>}
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  inputFocused: {
    backgroundColor: colors.card,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: spacing.base,
    color: colors.textPrimary,
    ...typography.body,
  },
  inputWithLeading: {
    paddingLeft: spacing.xs,
  },
  inputWithTrailing: {
    paddingRight: spacing.xs,
  },
  iconLeft: {
    paddingLeft: spacing.md,
  },
  iconRight: {
    paddingRight: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xxs,
  },
});
