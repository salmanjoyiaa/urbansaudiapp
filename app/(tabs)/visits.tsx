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
import { colors, spacing, borderRadius, typography } from '@/theme';
import { DateStrip } from '@/components/visits/DateStrip';
import { StatusChips } from '@/components/visits/StatusChips';
import { VisitCard } from '@/components/visits/VisitCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
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
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
      <Text style={styles.emptyTitle}>No visits</Text>
      <Text style={styles.emptySubtitle}>
        {statusFilter
          ? `No ${VISIT_STATUS_LABELS[statusFilter].toLowerCase()} visits for ${formatDate(selectedDate)}`
          : `No visits scheduled for ${formatDate(selectedDate)}`}
      </Text>
    </View>
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
          <TouchableOpacity
            onPress={() => openAgentPicker('bulk')}
            style={styles.bulkButton}
          >
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={styles.bulkButtonText}>
              Bulk Assign ({counters.pending})
            </Text>
          </TouchableOpacity>
        )}
        {visits.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowSendSummary(true)}
            style={styles.summaryButton}
          >
            <Ionicons name="send-outline" size={14} color={colors.success} />
            <Text style={styles.summaryButtonText}>Send Summary</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Visit List */}
      {isLoading ? (
        <View style={{ paddingHorizontal: spacing.base, gap: spacing.sm }}>
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
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressBackgroundColor={colors.surface}
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
              <Text style={styles.modalTitle}>Visit Details</Text>
              <TouchableOpacity onPress={() => setSelectedVisit(null)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              {/* Property */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>PROPERTY</Text>
                <Text style={styles.detailValue}>{selectedVisit.properties?.title || '—'}</Text>
                {selectedVisit.properties?.property_ref && (
                  <Text style={styles.detailMono}>ID: {selectedVisit.properties.property_ref}</Text>
                )}
              </View>

              {/* Visitor */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>VISITOR</Text>
                <Text style={styles.detailValue}>{selectedVisit.visitor_name}</Text>
                <Text style={styles.detailSub}>{selectedVisit.visitor_phone} · {selectedVisit.visitor_email}</Text>
              </View>

              {/* Schedule */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>SCHEDULE</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedVisit.visit_date)} · {formatTime(selectedVisit.visit_time)}
                </Text>
              </View>

              {/* Status */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>STATUS</Text>
                <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
                  <Badge
                    label={VISIT_STATUS_LABELS[selectedVisit.status as VisitStatus] || selectedVisit.status}
                    status={selectedVisit.status as VisitStatus}
                  />
                  {selectedVisit.visiting_status && (
                    <Badge
                      label={VISITING_STATUS_LABELS[selectedVisit.visiting_status] || selectedVisit.visiting_status}
                      color={{ bg: colors.surfaceElevated, text: colors.textSecondary, border: colors.border }}
                    />
                  )}
                </View>
              </View>

              {/* Agent */}
              {selectedVisit.visiting_agent && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>VISITING AGENT</Text>
                  <Text style={styles.detailValue}>{selectedVisit.visiting_agent.full_name}</Text>
                  {selectedVisit.visiting_agent.phone && (
                    <Text style={styles.detailSub}>{selectedVisit.visiting_agent.phone}</Text>
                  )}
                </View>
              )}

              {/* Admin Notes */}
              {selectedVisit.admin_notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>NOTES</Text>
                  <Text style={styles.detailSub}>{selectedVisit.admin_notes}</Text>
                </View>
              )}

              {/* Quick Actions */}
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
                      <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                      <Text style={[styles.quickActionText, { color: '#25D366' }]}>WhatsApp</Text>
                    </TouchableOpacity>
                  </>
                )}
                {selectedVisit.properties?.location_url && (
                  <TouchableOpacity
                    style={styles.quickAction}
                    onPress={() => Linking.openURL(selectedVisit.properties!.location_url!)}
                  >
                    <Ionicons name="map-outline" size={20} color={colors.info} />
                    <Text style={[styles.quickActionText, { color: colors.info }]}>Map</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
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
            <Text style={styles.modalTitle}>
              {agentPickerAction === 'bulk' ? 'Bulk Assign — Select Agent' : 'Assign Visiting Agent'}
            </Text>
            <TouchableOpacity onPress={() => setShowAgentPicker(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={agents || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.base }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No visiting agents</Text>
                <Text style={styles.emptySubtitle}>No approved visiting agents found</Text>
              </View>
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
                  <Ionicons name="person-circle" size={36} color={colors.primary} />
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
    borderColor: colors.primary,
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
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  summaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing['5xl'],
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.lg,
  },
  detailSection: {
    gap: spacing.xs,
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
  quickActions: {
    flexDirection: 'row',
    gap: spacing.base,
    marginTop: spacing.sm,
  },
  quickAction: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalActions: {
    padding: spacing.base,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Agent picker
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    gap: spacing.md,
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
