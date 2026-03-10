import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { timeAgo } from '@/utils/format';
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
    <TouchableOpacity
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
      style={[styles.row, !item.read && styles.unread]}
    >
      <View style={[styles.iconContainer, !item.read && styles.iconUnread]}>
        <Ionicons
          name={NOTIFICATION_ICONS[item.type] || NOTIFICATION_ICONS.default}
          size={18}
          color={!item.read ? colors.primary : colors.textMuted}
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header action */}
      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAllBar}
          onPress={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
        >
          <Ionicons name="checkmark-done-outline" size={16} color={colors.primary} />
          <Text style={styles.markAllText}>Mark all {unreadCount} as read</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
        contentContainerStyle={
          (!notifications || notifications.length === 0) ? { flex: 1 } : { paddingBottom: spacing['3xl'] }
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>All caught up</Text>
            <Text style={styles.emptySubtitle}>No notifications to display</Text>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  markAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  unread: {
    backgroundColor: colors.surface,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconUnread: {
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textSecondary,
  },
  emptySubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
});
