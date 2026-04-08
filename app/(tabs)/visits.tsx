import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, alpha, spacing, borderRadius, typography, ambientShadow } from '@/theme';
import { DateStrip } from '@/components/visits/DateStrip';
import { StatusChips } from '@/components/visits/StatusChips';
import { VisitCard } from '@/components/visits/VisitCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AppEmptyState } from '@/components/ui/AppEmptyState';
import { PressableScale } from '@/components/ui/PressableScale';
import { SendDaySummarySheet } from '@/components/visits/SendDaySummarySheet';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useVisitFilterStore } from '@/store/visitFilterStore';
import { useVisitsByDate, useVisitingAgents, useUpdateVisitStatus, useBulkAssign } from '@/hooks/useVisits';
import { formatTime, formatDate } from '@/utils/format';
import { VISIT_STATUS_LABELS, VISITING_STATUS_LABELS, getStatusColors } from '@/utils/constants';
import type { VisitWithDetails, VisitStatus, VisitingAgentOption } from '@/types';

export default function VisitsScreen() {
  const { selectedDate, statusFilter, setSelectedDate, setStatusFilter } = useVisitFilterStore();
  const { data, isLoading, refetch, isRefetching } = useVisitsByDate(selectedDate, statusFilter);
  const { data: agents } = useVisitingAgents();
  const updateStatus = useUpdateVisitStatus();
  const bulkAssign = useBulkAssign();

  const [selectedVisit, setSelectedVisit] = useState<VisitWithDetails | null>(null);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [agentPickerAction, setAgentPickerAction] = useState<'assign' | 'bulk'>('assign');
  const [actionLoading, setActionLoading] = useState(false);
  const [showSendSummary, setShowSendSummary] = useState(false);

  const visits = data?.visits ?? [];
  const counters = data?.counters ?? { pending: 0, assigned: 0, confirmed: 0, cancelled: 0, completed: 0 };

  const handleVisitPress = useCallback((visit: VisitWithDetails) => {
    setSelectedVisit(visit);
  }, []);

  const handleAction = useCallback(async (
    visitId: string,
    status: 'assigned' | 'confirmed' | 'cancelled' | 'completed',
    visiting_agent_id?: string
  ) => {
    setActionLoading(true);
    try {
      await updateStatus.mutateAsync({ visitId, status, visiting_agent_id });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedVisit(null);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }, [updateStatus]);

  const handleBulkAssign = useCallback(async (agentId: string) => {
    setActionLoading(true);
    try {
      const result = await bulkAssign.mutateAsync({ date: selectedDate, visiting_agent_id: agentId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Bulk Assign Complete',
        `${result.assignedCount} visits assigned${result.conflictCount > 0 ? `, ${result.conflictCount} conflicts skipped` : ''}`
      );
      setShowAgentPicker(false);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', err instanceof Error ? err.message : 'Bulk assign failed');
    } finally {
      setActionLoading(false);
    }
  }, [bulkAssign, selectedDate]);

  const openAgentPicker = (action: 'assign' | 'bulk') => {
    setAgentPickerAction(action);
    setShowAgentPicker(true);
  };

  const renderVisit = useCallback(({ item }: { item: VisitWithDetails }) => (
    <VisitCard visit={item} onPress={() => handleVisitPress(item)} />
  ), [handleVisitPress]);

  const renderEmpty = () => (
    <AppEmptyState
      icon="calendar-outline"
      title="No visits"
      subtitle={statusFilter
        ? `No ${VISIT_STATUS_LABELS[statusFilter].toLowerCase()} visits for ${formatDate(selectedDate)}`
        : `No visits scheduled for ${formatDate(selectedDate)}`}
    />
  );

  return (
    <View style={styles.container}>
      {/* Date Strip */}
      <DateStrip
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Status Chips */}
      <StatusChips
        counters={counters}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* Action Bar */}
      <View style={styles.actionBar}>
        {counters.pending > 0 && (
          <PressableScale
            onPress={() => openAgentPicker('bulk')}
            style={styles.bulkButton}
          >
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={styles.bulkButtonText}>
              Bulk Assign ({counters.pending})
            </Text>
          </PressableScale>
        )}
        {visits.length > 0 && (
          <PressableScale
            onPress={() => setShowSendSummary(true)}
            style={styles.summaryButton}
          >
            <Ionicons name="send-outline" size={14} color={colors.success} />
            <Text style={styles.summaryButtonText}>Send Summary</Text>
          </PressableScale>
        )}
      </View>

      {/* Visit List */}
      {isLoading ? (
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.md }}>
          {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={renderVisit}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.secondary}
              colors={[colors.secondary]}
              progressBackgroundColor={colors.surfaceElevated}
            />
          }
          contentContainerStyle={visits.length === 0 ? { flex: 1 } : { paddingBottom: spacing['3xl'] }}
        />
      )}

      {/* Visit Detail Modal */}
      <Modal
        visible={!!selectedVisit}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedVisit(null)}
      >
        {selectedVisit && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTextWrap}>
                <Text style={styles.modalEyebrow}>Visit detail</Text>
                <Text style={styles.modalTitle}>{selectedVisit.properties?.title || 'Visit Details'}</Text>
                <Text style={styles.modalSubtitle}>{selectedVisit.visitor_name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedVisit(null)} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalHero}>
              <View style={styles.modalHeroTopRow}>
                <Badge
                  label={VISIT_STATUS_LABELS[selectedVisit.status as VisitStatus] || selectedVisit.status}
                  status={selectedVisit.status as VisitStatus}
                  dot
                />
                {selectedVisit.properties?.property_ref && (
                  <Text style={styles.heroMetaText}>ID {selectedVisit.properties.property_ref}</Text>
                )}
              </View>
              <Text style={styles.modalHeroTitle} numberOfLines={2}>
                {selectedVisit.properties?.title || 'Unknown Property'}
              </Text>
              <Text style={styles.modalHeroSubtitle} numberOfLines={2}>
                {selectedVisit.properties?.property_ref || 'Property location not provided'}
              </Text>
              <View style={styles.modalHeroMetaRow}>
                <View style={styles.modalHeroMetaItem}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textInverse} />
                  <Text style={styles.modalHeroMetaText}>{formatDate(selectedVisit.visit_date)}</Text>
                </View>
                <View style={styles.modalHeroMetaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.textInverse} />
                  <Text style={styles.modalHeroMetaText}>{formatTime(selectedVisit.visit_time)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalContent}>
              {/* Property */}
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>PROPERTY</Text>
                <Text style={styles.detailValue}>{selectedVisit.properties?.title || '—'}</Text>
                {selectedVisit.properties?.property_ref && (
                  <Text style={styles.detailMono}>ID: {selectedVisit.properties.property_ref}</Text>
                )}
              </View>

              {/* Visitor */}
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>VISITOR</Text>
                <Text style={styles.detailValue}>{selectedVisit.visitor_name}</Text>
                <Text style={styles.detailSub}>{selectedVisit.visitor_phone} · {selectedVisit.visitor_email}</Text>
              </View>

              {/* Schedule */}
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>SCHEDULE</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedVisit.visit_date)} · {formatTime(selectedVisit.visit_time)}
                </Text>
              </View>

              {/* Status */}
              <View style={styles.detailCard}>
                <Text style={styles.detailLabel}>STATUS</Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <Badge
                    label={VISIT_STATUS_LABELS[selectedVisit.status as VisitStatus] || selectedVisit.status}
                    status={selectedVisit.status as VisitStatus}
                  />
                  {selectedVisit.visiting_status && (
                    <Badge
                      label={VISITING_STATUS_LABELS[selectedVisit.visiting_status] || selectedVisit.visiting_status}
                      color={{ bg: colors.surface, text: colors.textSecondary, border: colors.border }}
                    />
                  )}
                </View>
              </View>

              {/* Agent */}
              {selectedVisit.visiting_agent && (
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>VISITING AGENT</Text>
                  <Text style={styles.detailValue}>{selectedVisit.visiting_agent.full_name}</Text>
                  {selectedVisit.visiting_agent.phone && (
                    <Text style={styles.detailSub}>{selectedVisit.visiting_agent.phone}</Text>
                  )}
                </View>
              )}

              {/* Admin Notes */}
              {selectedVisit.admin_notes && (
                <View style={styles.detailCard}>
                  <Text style={styles.detailLabel}>NOTES</Text>
                  <Text style={styles.detailSub}>{selectedVisit.admin_notes}</Text>
                </View>
              )}

              {/* Quick Actions */}
              <View style={styles.quickActionsCard}>
                <Text style={styles.detailLabel}>QUICK ACTIONS</Text>
                <View style={styles.quickActions}>
                  {selectedVisit.visitor_phone && (
                    <>
                      <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => Linking.openURL(`tel:${selectedVisit.visitor_phone}`)}
                      >
                        <Ionicons name="call-outline" size={20} color={colors.success} />
                        <Text style={[styles.quickActionText, { color: colors.success }]}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => {
                          const clean = selectedVisit.visitor_phone.replace(/\D/g, '');
                          Linking.openURL(`https://wa.me/${clean}`);
                        }}
                      >
                        <Ionicons name="logo-whatsapp" size={20} color={colors.whatsapp} />
                        <Text style={[styles.quickActionText, { color: colors.whatsapp }]}>WhatsApp</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {selectedVisit.properties?.location_url && (
                    <TouchableOpacity
                      style={styles.quickAction}
                      onPress={() => Linking.openURL(selectedVisit.properties!.location_url!)}
                    >
                      <Ionicons name="map-outline" size={20} color={colors.secondary} />
                      <Text style={[styles.quickActionText, { color: colors.secondary }]}>Map</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActionsDock}>
              {selectedVisit.status === 'pending' && (
                <Button
                  title="Assign Agent"
                  onPress={() => openAgentPicker('assign')}
                  variant="primary"
                  icon={<Ionicons name="person-add-outline" size={16} color={colors.textInverse} />}
                  loading={actionLoading}
                />
              )}
              {selectedVisit.status === 'assigned' && (
                <Button
                  title="Confirm Visit"
                  onPress={() => handleAction(selectedVisit.id, 'confirmed')}
                  variant="primary"
                  icon={<Ionicons name="checkmark-circle-outline" size={16} color={colors.textInverse} />}
                  loading={actionLoading}
                />
              )}
              {(selectedVisit.status === 'pending' || selectedVisit.status === 'assigned') && (
                <Button
                  title="Cancel Visit"
                  onPress={() => {
                    Alert.alert('Cancel Visit', 'Are you sure?', [
                      { text: 'No', style: 'cancel' },
                      { text: 'Cancel Visit', style: 'destructive',
                        onPress: () => handleAction(selectedVisit.id, 'cancelled') },
                    ]);
                  }}
                  variant="destructive"
                  icon={<Ionicons name="close-circle-outline" size={16} color="#FFF" />}
                  loading={actionLoading}
                />
              )}
              {selectedVisit.status === 'confirmed' && (
                <Button
                  title="Mark Completed"
                  onPress={() => handleAction(selectedVisit.id, 'completed')}
                  variant="outline"
                  icon={<Ionicons name="ribbon-outline" size={16} color={colors.textPrimary} />}
                  loading={actionLoading}
                />
              )}
            </View>
          </View>
        )}
      </Modal>

      {/* Agent Picker Modal */}
      <Modal
        visible={showAgentPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAgentPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTextWrap}>
              <Text style={styles.modalEyebrow}>Select agent</Text>
              <Text style={styles.modalTitle}>
                {agentPickerAction === 'bulk' ? 'Bulk Assign — Select Agent' : 'Assign Visiting Agent'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowAgentPicker(false)} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={agents || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.base, gap: spacing.md }}
            ListEmptyComponent={
              <AppEmptyState
                icon="people-outline"
                title="No visiting agents"
                subtitle="No approved visiting agents found."
              />
            }
            renderItem={({ item }: { item: VisitingAgentOption }) => (
              <TouchableOpacity
                style={styles.agentRow}
                activeOpacity={0.7}
                onPress={() => {
                  if (agentPickerAction === 'bulk') {
                    Alert.alert(
                      'Bulk Assign',
                      `Assign all pending visits on ${formatDate(selectedDate)} to ${item.name}?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Assign All', onPress: () => handleBulkAssign(item.id) },
                      ]
                    );
                  } else if (selectedVisit) {
                    handleAction(selectedVisit.id, 'assigned', item.id);
                    setShowAgentPicker(false);
                  }
                }}
              >
                <View style={styles.agentAvatar}>
                  <Ionicons name="person-circle" size={40} color={colors.secondary} />
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{item.name}</Text>
                  <Text style={styles.agentRole}>Visiting Agent</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Send Day Summary Sheet */}
      <SendDaySummarySheet
        visible={showSendSummary}
        date={selectedDate}
        onClose={() => setShowSendSummary(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  bulkButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: alpha(colors.success, 0.18),
  },
  summaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingTop: spacing['2xl'],
    paddingBottom: spacing.base,
  },
  modalHeaderTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  modalEyebrow: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 2,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHero: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    ...ambientShadow,
  },
  modalHeroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroMetaText: {
    ...typography.caption,
    color: alpha(colors.textInverse, 0.7),
  },
  modalHeroTitle: {
    ...typography.h2,
    color: colors.textInverse,
  },
  modalHeroSubtitle: {
    ...typography.bodySmall,
    color: alpha(colors.textInverse, 0.72),
    marginTop: spacing.xs,
  },
  modalHeroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalHeroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: alpha(colors.textInverse, 0.10),
  },
  modalHeroMetaText: {
    ...typography.caption,
    color: colors.textInverse,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: spacing.base,
    gap: spacing.lg,
  },
  detailCard: {
    gap: spacing.xs,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...ambientShadow,
  },
  detailLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  detailValue: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  detailMono: {
    ...typography.mono,
    color: colors.textMuted,
  },
  detailSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  quickActionsCard: {
    gap: spacing.xs,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...ambientShadow,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.base,
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  quickAction: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalActionsDock: {
    padding: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  // Agent picker
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    gap: spacing.md,
    ...ambientShadow,
  },
  agentAvatar: {},
  agentInfo: {
    flex: 1,
  },
  agentName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  agentRole: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
