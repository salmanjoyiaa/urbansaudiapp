import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/theme';
import { PressableScale } from '@/components/ui/PressableScale';
import { Badge } from '@/components/ui/Badge';
import type { VisitWithDetails, VisitStatus } from '@/types';
import { formatTime } from '@/utils/format';
import { VISIT_STATUS_LABELS, getStatusColors } from '@/utils/constants';

interface VisitCardProps {
  visit: VisitWithDetails;
  onPress: () => void;
}

/**
 * Visit request card — displays property, visitor, time, status, and agent.
 * Left colored status bar + PressableScale for premium tap feedback.
 */
export function VisitCard({ visit, onPress }: VisitCardProps) {
  const statusColors = getStatusColors(visit.status as VisitStatus);
  const propertyRef = visit.properties?.property_ref;

  return (
    <PressableScale onPress={onPress} style={styles.wrapper}>
      <View style={styles.card}>
        {/* Left status indicator */}
        <View style={[styles.statusBar, { backgroundColor: statusColors.text }]} />

        <View style={styles.content}>
          {/* Top row: Property + Time */}
          <View style={styles.topRow}>
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle} numberOfLines={1}>
                {visit.properties?.title || 'Unknown Property'}
              </Text>
              {propertyRef && (
                <Text style={styles.propertyRef}>{propertyRef}</Text>
              )}
            </View>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color={colors.textMuted} />
              <Text style={styles.timeText}>{formatTime(visit.visit_time)}</Text>
            </View>
          </View>

          {/* Middle: Visitor info */}
          <View style={styles.visitorRow}>
            <Ionicons name="person-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.visitorName}>{visit.visitor_name}</Text>
            {visit.visitor_phone && (
              <Text style={styles.visitorPhone}>{visit.visitor_phone}</Text>
            )}
          </View>

          {/* Bottom: Status + Agent */}
          <View style={styles.bottomRow}>
            <Badge
              label={VISIT_STATUS_LABELS[visit.status as VisitStatus] || visit.status}
              status={visit.status as VisitStatus}
              size="sm"
              dot
            />
            {visit.visiting_agent ? (
              <View style={styles.agentBadge}>
                <Ionicons name="person-circle-outline" size={14} color={colors.accent} />
                <Text style={styles.agentName}>{visit.visiting_agent.full_name}</Text>
              </View>
            ) : visit.status === 'pending' ? (
              <View style={styles.unassignedBadge}>
                <Ionicons name="alert-circle-outline" size={14} color={colors.warning} />
                <Text style={styles.unassignedText}>Unassigned</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Chevron */}
        <View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.soft,
  },
  statusBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propertyInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  propertyTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  propertyRef: {
    ...typography.mono,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  timeText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  visitorName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  visitorPhone: {
    ...typography.caption,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  agentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  agentName: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '500',
  },
  unassignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unassignedText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '500',
  },
  chevronContainer: {
    justifyContent: 'center',
    paddingRight: spacing.md,
  },
});
