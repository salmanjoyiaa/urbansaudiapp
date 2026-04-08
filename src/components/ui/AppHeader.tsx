import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { colors, spacing, typography } from '@/theme';

interface AppHeaderProps {
  /** Screen title */
  title: string;
  /** Show back button on the left */
  onBack?: () => void;
  /** Right-side action elements */
  rightAction?: React.ReactNode;
  /** Whether to add safe area top padding */
  withSafeArea?: boolean;
}

/**
 * Consistent screen header with title, optional back button, and right actions.
 *
 * Usage:
 * ```tsx
 * <AppHeader title="Visit Details" onBack={() => router.back()} />
 * ```
 */
export function AppHeader({ title, onBack, rightAction, withSafeArea = false }: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, withSafeArea && { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.left}>
        {onBack && (
          <PressableScale onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
          </PressableScale>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>
        {rightAction || <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  left: {
    width: 40,
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 40,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
