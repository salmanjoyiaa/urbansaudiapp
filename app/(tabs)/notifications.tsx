import React from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { timeAgo } from '@/utils/format';
import { PressableScale } from '@/components/ui/PressableScale';
import { AppEmptyState } from '@/components/ui/AppEmptyState';
import type { Notification } from '@/types';

const NOTIFICATION_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  visit_status: 'calendar-outline',
  new_visit: 'add-circle-outline',
  agent_status: 'person-outline',
  default: 'notifications-outline',
};

export default function NotificationsScreen() {
  const { data: notifications, isLoading, refetch, isRefetching } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  const handlePress = (notification: Notification) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <PressableScale
      onPress={() => handlePress(item)}
      style={[styles.row, !item.read && styles.unread]}
    >
      <View style={[styles.iconContainer, !item.read && styles.iconUnread]}>
        <Ionicons
          name={NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.default}
          size={18}
          color={!item.read ? colors.secondary : colors.textMuted}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </PressableScale>
  );

  return (
    <View style={styles.container}>
      {/* Header action */}
      {unreadCount > 0 && (
        <PressableScale
          style={styles.markAllBar}
          onPress={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
        >
          <Ionicons name="checkmark-done-outline" size={16} color={colors.secondary} />
          <Text style={styles.markAllText}>Mark all {unreadCount} as read</Text>
        </PressableScale>
      )}

      <FlatList
        data={notifications || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.secondary}
            colors={[colors.secondary]}
            progressBackgroundColor={colors.surfaceElevated}
          />
        }
        contentContainerStyle={
          (!notifications || notifications.length === 0) ? { flex: 1 } : { paddingBottom: spacing['3xl'] }
        }
        ListEmptyComponent={
          <AppEmptyState
            icon="notifications-off-outline"
            title="All caught up"
            subtitle="No notifications to display right now."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  markAllBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    backgroundColor: colors.secondaryLight,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    borderRadius: borderRadius.full,
  },
  markAllText: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    gap: spacing.md,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unread: {
    backgroundColor: colors.surface,
    borderColor: colors.primaryBorder,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUnread: {
    backgroundColor: colors.secondaryLight,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  titleUnread: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  body: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginTop: 6,
  },
});
