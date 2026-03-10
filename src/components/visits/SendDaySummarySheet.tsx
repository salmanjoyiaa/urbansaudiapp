import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useVisitingAgents, useSendDaySummary } from '@/hooks/useVisits';
import { formatDate } from '@/utils/format';
import type { VisitingAgentOption } from '@/types';

interface SendDaySummarySheetProps {
  visible: boolean;
  date: string;
  onClose: () => void;
}

type RecipientType = 'visiting_agent' | 'property_agent';

export function SendDaySummarySheet({ visible, date, onClose }: SendDaySummarySheetProps) {
  const { data: agents } = useVisitingAgents();
  const sendSummary = useSendDaySummary();

  const [recipientType, setRecipientType] = useState<RecipientType>('visiting_agent');
  const [selectedAgent, setSelectedAgent] = useState<VisitingAgentOption | null>(null);
  const [showAgentList, setShowAgentList] = useState(false);

  const handleSend = async (emailOnly: boolean) => {
    if (!selectedAgent) {
      Alert.alert('Select Agent', 'Please select an agent first.');
      return;
    }

    try {
      const result = await sendSummary.mutateAsync({
        date,
        recipientType,
        agentId: selectedAgent.id,
        options: { emailOnly },
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const sent = result.sent || {};
      Alert.alert(
        'Summary Sent',
        `Sent to ${selectedAgent.name}\n${sent.email ? '✅ Email' : ''}${sent.whatsApp ? ' ✅ WhatsApp' : ''}\n${result.totalVisits} visits included`,
        [{ text: 'Done', onPress: onClose }]
      );
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Failed', err instanceof Error ? err.message : 'Could not send summary');
    }
  };

  const handlePreview = async () => {
    if (!selectedAgent) {
      Alert.alert('Select Agent', 'Please select an agent first.');
      return;
    }

    try {
      const result = await sendSummary.mutateAsync({
        date,
        recipientType,
        agentId: selectedAgent.id,
        options: { preview: true },
      });

      Alert.alert(
        `Preview (${result.totalVisits} visits)`,
        result.text || 'No visits to summarize'
      );
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Preview failed');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Send Day Summary</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Date display */}
          <Card>
            <View style={styles.dateRow}>
              <Ionicons name="calendar" size={18} color={colors.primary} />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
          </Card>

          {/* Recipient Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>RECIPIENT TYPE</Text>
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segment, recipientType === 'visiting_agent' && styles.segmentActive]}
                onPress={() => { setRecipientType('visiting_agent'); setSelectedAgent(null); }}
              >
                <Ionicons
                  name="walk-outline"
                  size={16}
                  color={recipientType === 'visiting_agent' ? colors.textInverse : colors.textSecondary}
                />
                <Text style={[styles.segmentText, recipientType === 'visiting_agent' && styles.segmentTextActive]}>
                  Visiting Agent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segment, recipientType === 'property_agent' && styles.segmentActive]}
                onPress={() => { setRecipientType('property_agent'); setSelectedAgent(null); }}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={recipientType === 'property_agent' ? colors.textInverse : colors.textSecondary}
                />
                <Text style={[styles.segmentText, recipientType === 'property_agent' && styles.segmentTextActive]}>
                  Property Agent
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Agent Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SELECT AGENT</Text>
            <TouchableOpacity
              style={styles.agentSelector}
              onPress={() => setShowAgentList(true)}
            >
              {selectedAgent ? (
                <View style={styles.selectedAgentRow}>
                  <Ionicons name="person-circle" size={24} color={colors.primary} />
                  <Text style={styles.selectedAgentName}>{selectedAgent.name}</Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Tap to select an agent</Text>
              )}
              <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Preview"
            onPress={handlePreview}
            variant="outline"
            loading={sendSummary.isPending}
            icon={<Ionicons name="eye-outline" size={16} color={colors.textPrimary} />}
          />
          <Button
            title="Send Email Only"
            onPress={() => handleSend(true)}
            variant="secondary"
            loading={sendSummary.isPending}
            icon={<Ionicons name="mail-outline" size={16} color={colors.textPrimary} />}
          />
          <Button
            title="Send Email + WhatsApp"
            onPress={() => handleSend(false)}
            variant="primary"
            loading={sendSummary.isPending}
            icon={<Ionicons name="send-outline" size={16} color={colors.textInverse} />}
          />
        </View>
      </View>

      {/* Nested Agent List Modal */}
      <Modal
        visible={showAgentList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAgentList(false)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Agent</Text>
            <TouchableOpacity onPress={() => setShowAgentList(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={agents || []}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: spacing.base }}
            renderItem={({ item }: { item: VisitingAgentOption }) => (
              <TouchableOpacity
                style={[
                  styles.agentListRow,
                  selectedAgent?.id === item.id && styles.agentListRowActive,
                ]}
                onPress={() => {
                  setSelectedAgent(item);
                  setShowAgentList(false);
                }}
              >
                <Ionicons name="person-circle" size={32} color={colors.primary} />
                <Text style={styles.agentListName}>{item.name}</Text>
                {selectedAgent?.id === item.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No agents available</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.lg,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.textInverse,
  },
  agentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 52,
  },
  selectedAgentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectedAgentName: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  placeholderText: {
    ...typography.body,
    color: colors.textMuted,
  },
  actions: {
    padding: spacing.base,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  agentListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  agentListRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  agentListName: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
