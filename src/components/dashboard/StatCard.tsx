import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { PressableScale } from '@/components/ui/PressableScale';

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
  onPress?: () => void;
}

/**
 * Dashboard metric card with icon, value, and title.
 * Wraps in PressableScale when onPress is provided.
 */
export function StatCard({ title, value, icon, accentColor = colors.accent, onPress }: StatCardProps) {
  const content = (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${accentColor}14` }]}>
          <Ionicons name={icon} size={20} color={accentColor} />
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress}>
        {content}
      </PressableScale>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    minWidth: 100,
    flex: 1,
    ...shadows.soft,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  title: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
