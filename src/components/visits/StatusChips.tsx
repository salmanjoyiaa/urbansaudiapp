import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { PressableScale } from '@/components/ui/PressableScale';
import type { VisitStatus, VisitStatusCounts } from '@/types';
import { VISIT_STATUS_LABELS, VISIT_STATUS_ICONS, getStatusColors } from '@/utils/constants';

interface StatusChipsProps {
  counters: VisitStatusCounts;
  activeFilter: VisitStatus | null;
  onFilterChange: (status: VisitStatus | null) => void;
}

const STATUSES: VisitStatus[] = ['pending', 'assigned', 'confirmed', 'cancelled', 'completed'];

/**
 * Horizontal scrolling status filter chips with count bubbles.
 * Uses PressableScale for premium tap feedback.
 */
export function StatusChips({ counters, activeFilter, onFilterChange }: StatusChipsProps) {
  const total = Object.values(counters).reduce((a, b) => a + b, 0);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* All chip */}
      <PressableScale
        onPress={() => onFilterChange(null)}
        style={[
          styles.chip,
          activeFilter === null && styles.chipActive,
        ]}
      >
        <Text style={[styles.chipLabel, activeFilter === null && styles.chipLabelActive]}>
          All
        </Text>
        <View style={[styles.countBubble, activeFilter === null && { backgroundColor: colors.primary }]}>
          <Text style={[styles.countText, activeFilter === null && { color: colors.textInverse }]}>
            {total}
          </Text>
        </View>
      </PressableScale>

      {STATUSES.map((status) => {
        const isActive = activeFilter === status;
        const statusColors = getStatusColors(status);
        const count = counters[status];

        return (
          <PressableScale
            key={status}
            onPress={() => onFilterChange(isActive ? null : status)}
            style={[
              styles.chip,
              isActive && { backgroundColor: statusColors.bg, borderColor: statusColors.border },
            ]}
          >
            <Ionicons
              name={VISIT_STATUS_ICONS[status] as keyof typeof Ionicons.glyphMap}
              size={14}
              color={isActive ? statusColors.text : colors.textMuted}
            />
            <Text style={[styles.chipLabel, isActive && { color: statusColors.text }]}>
              {VISIT_STATUS_LABELS[status]}
            </Text>
            <View
              style={[
                styles.countBubble,
                isActive && { backgroundColor: statusColors.text },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  isActive && { color: colors.background },
                ]}
              >
                {count}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryBorder,
  },
  chipLabel: {
    ...typography.caption,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipLabelActive: {
    color: colors.primary,
  },
  countBubble: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.shimmer,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
});
