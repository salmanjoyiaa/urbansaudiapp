import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
  onPress?: () => void;
}

export function StatCard({ title, value, icon, accentColor = colors.primary, onPress }: StatCardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.card}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
        <Ionicons name={icon} size={20} color={accentColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minWidth: 100,
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
