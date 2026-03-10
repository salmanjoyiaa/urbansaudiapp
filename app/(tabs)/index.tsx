import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme';
import { StatCard } from '@/components/dashboard/StatCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/store/authStore';
import { useDashboardCounts, useRecentActivity } from '@/hooks/useDashboard';
import { timeAgo } from '@/utils/format';

export default function DashboardScreen() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { data: counts, isLoading, refetch, isRefetching } = useDashboardCounts();
  const { data: activity } = useRecentActivity();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressBackgroundColor={colors.surface}
        />
      }
    >
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {greeting()}, {profile?.full_name?.split(' ')[0] || 'Admin'}
        </Text>
        <Text style={styles.greetingSubtitle}>
          Here&apos;s your platform overview
        </Text>
      </View>

      {/* Action Required */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACTION REQUIRED</Text>
        {isLoading ? (
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.gridItem}>
                <Skeleton width="100%" height={90} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Visits"
                value={counts?.pendingVisits ?? 0}
                icon="calendar-outline"
                accentColor={colors.warning}
                onPress={() => router.push('/(tabs)/visits')}
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Properties"
                value={counts?.pendingProperties ?? 0}
                icon="home-outline"
                accentColor={colors.info}
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Prop. Agents"
                value={counts?.pendingPropertyAgents ?? 0}
                icon="people-outline"
                accentColor="#F97316"
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Visit Agents"
                value={counts?.pendingVisitingAgents ?? 0}
                icon="walk-outline"
                accentColor="#8B5CF6"
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Leads"
                value={counts?.pendingLeads ?? 0}
                icon="mail-outline"
                accentColor="#EC4899"
              />
            </View>
            <View style={styles.gridItem}>
              <StatCard
                title="Pending Maint."
                value={counts?.pendingMaintenance ?? 0}
                icon="construct-outline"
                accentColor="#14B8A6"
              />
            </View>
          </View>
        )}
      </View>

      {/* Platform Totals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PLATFORM TOTALS</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <StatCard
              title="Active Properties"
              value={counts?.activeProperties ?? 0}
              icon="business-outline"
              accentColor={colors.success}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Property Agents"
              value={counts?.approvedPropertyAgents ?? 0}
              icon="briefcase-outline"
              accentColor={colors.info}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Visiting Team"
              value={counts?.approvedVisitingAgents ?? 0}
              icon="walk-outline"
              accentColor="#A78BFA"
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Customers"
              value={counts?.totalCustomers ?? 0}
              icon="person-outline"
              accentColor={colors.primary}
            />
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      {activity && activity.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          <View style={styles.activityList}>
            {activity.slice(0, 8).map((entry: { id: string; action: string; entity_type: string; created_at: string }) => (
              <View key={entry.id} style={styles.activityRow}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>
                    {entry.action.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.activityMeta}>
                    {entry.entity_type} · {timeAgo(entry.created_at)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: spacing['3xl'] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.base,
  },
  greeting: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.xl,
  },
  greetingText: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  greetingSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },
  activityList: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryMuted,
    marginTop: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  activityMeta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
