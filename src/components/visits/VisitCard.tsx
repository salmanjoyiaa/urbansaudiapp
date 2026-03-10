import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { Badge } from '@/components/ui/Badge';
import type { VisitWithDetails, VisitStatus } from '@/types';
import { formatTime } from '@/utils/format';
import { VISIT_STATUS_LABELS, getStatusColors } from '@/utils/constants';

interface VisitCardProps {
  visit: VisitWithDetails;
  onPress: () => void;
}

export function VisitCard({ visit, onPress }: VisitCardProps) {
  const statusColors = getStatusColors(visit.status as VisitStatus);
  const propertyRef = visit.properties?.property_ref;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.card}
    >
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
          />
          {visit.visiting_agent ? (
            <View style={styles.agentBadge}>
              <Ionicons name="person-circle-outline" size={14} color={colors.info} />
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  statusBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
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
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
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
    fontSize: 12,
    color: colors.info,
    fontWeight: '500',
  },
  unassignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unassignedText: {
    fontSize: 12,
    color: colors.warning,
    fontWeight: '500',
  },
  chevronContainer: {
    justifyContent: 'center',
    paddingRight: spacing.md,
  },
});
