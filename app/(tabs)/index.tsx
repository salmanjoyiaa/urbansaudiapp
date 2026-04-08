import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, alpha, spacing, borderRadius, typography, shadows } from '@/theme';
import { StatCard } from '@/components/dashboard/StatCard';
import { Skeleton, SkeletonStatCard } from '@/components/ui/Skeleton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeInView } from '@/components/ui/Animated';
import { useAuthStore } from '@/store/authStore';
import { useDashboardCounts, useRecentActivity } from '@/hooks/useDashboard';
import { timeAgo } from '@/utils/format';

/**
 * Dashboard — hero greeting + stat grids + recent activity.
 * Uses Outfit for headings, categorical theme colors (no hardcoded hex).
 */
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
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={colors.surfaceElevated}
        />
      }
    >
      {/* Hero Greeting */}
      <FadeInView style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>UrbanSaudi Admin</Text>
            <Text style={styles.greetingText}>
              {greeting()}, {profile?.full_name?.split(' ')[0] || 'Admin'}
            </Text>
            <Text style={styles.greetingSubtitle}>
              Your operations at a glance
            </Text>
          </View>
          <View style={styles.heroMonogram}>
            <Text style={styles.heroMonogramText}>U</Text>
          </View>
        </View>

        <View style={styles.heroMetrics}>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{counts?.pendingVisits ?? 0}</Text>
            <Text style={styles.heroMetricLabel}>Pending visits</Text>
          </View>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{counts?.activeProperties ?? 0}</Text>
            <Text style={styles.heroMetricLabel}>Active properties</Text>
          </View>
          <View style={styles.heroMetric}>
            <Text style={styles.heroMetricValue}>{counts?.totalCustomers ?? 0}</Text>
            <Text style={styles.heroMetricLabel}>Customers</Text>
          </View>
        </View>
      </FadeInView>

      {/* Action Required */}
      <View style={styles.section}>
        <SectionHeader
          title="ACTION REQUIRED"
          actionLabel="View visits"
          onAction={() => router.push('/(tabs)/visits')}
        />
        {isLoading ? (
          <View style={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={styles.gridItem}>
                <SkeletonStatCard />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <FadeInView delay={0}>
                <StatCard
                  title="Pending Visits"
                  value={counts?.pendingVisits ?? 0}
                  icon="calendar-outline"
                  accentColor={colors.category.visits}
                  onPress={() => router.push('/(tabs)/visits')}
                />
              </FadeInView>
            </View>
            <View style={styles.gridItem}>
              <FadeInView delay={60}>
                <StatCard
                  title="Pending Properties"
                  value={counts?.pendingProperties ?? 0}
                  icon="home-outline"
                  accentColor={colors.category.properties}
                />
              </FadeInView>
            </View>
            <View style={styles.gridItem}>
              <FadeInView delay={120}>
                <StatCard
                  title="Pending Prop. Agents"
                  value={counts?.pendingPropertyAgents ?? 0}
                  icon="people-outline"
                  accentColor={colors.category.propertyAgents}
                />
              </FadeInView>
            </View>
            <View style={styles.gridItem}>
              <FadeInView delay={180}>
                <StatCard
                  title="Pending Visit Agents"
                  value={counts?.pendingVisitingAgents ?? 0}
                  icon="walk-outline"
                  accentColor={colors.category.visitingAgents}
                />
              </FadeInView>
            </View>
            <View style={styles.gridItem}>
              <FadeInView delay={240}>
                <StatCard
                  title="Pending Leads"
                  value={counts?.pendingLeads ?? 0}
                  icon="mail-outline"
                  accentColor={colors.category.leads}
                />
              </FadeInView>
            </View>
            <View style={styles.gridItem}>
              <FadeInView delay={300}>
                <StatCard
                  title="Pending Maint."
                  value={counts?.pendingMaintenance ?? 0}
                  icon="construct-outline"
                  accentColor={colors.category.maintenance}
                />
              </FadeInView>
            </View>
          </View>
        )}
      </View>

      {/* Platform Totals */}
      <View style={styles.section}>
        <SectionHeader title="PLATFORM TOTALS" />
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <StatCard
              title="Active Properties"
              value={counts?.activeProperties ?? 0}
              icon="business-outline"
              accentColor={colors.category.active}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Property Agents"
              value={counts?.approvedPropertyAgents ?? 0}
              icon="briefcase-outline"
              accentColor={colors.category.properties}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Visiting Team"
              value={counts?.approvedVisitingAgents ?? 0}
              icon="walk-outline"
              accentColor={colors.category.visitingAgents}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              title="Customers"
              value={counts?.totalCustomers ?? 0}
              icon="person-outline"
              accentColor={colors.category.customers}
            />
          </View>
        </View>
      </View>

      {/* Recent Activity */}
      {activity && activity.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="RECENT ACTIVITY" />
          <View style={styles.activityList}>
            {activity.slice(0, 8).map((entry: { id: string; action: string; entity_type: string; created_at: string }, index: number) => (
              <FadeInView key={entry.id} delay={index * 50}>
                <View style={styles.activityRow}>
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
              </FadeInView>
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
  heroCard: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl,
    padding: spacing.base,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primary,
    ...shadows.medium,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroCopy: {
    flex: 1,
  },
  heroEyebrow: {
    ...typography.label,
    color: alpha(colors.textInverse, 0.68),
    marginBottom: spacing.xs,
  },
  heroMonogram: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: alpha(colors.textInverse, 0.10),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: alpha(colors.textInverse, 0.12),
  },
  heroMonogramText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -1,
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.base,
  },
  heroMetric: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: alpha(colors.textInverse, 0.08),
    borderWidth: 1,
    borderColor: alpha(colors.textInverse, 0.08),
  },
  heroMetricValue: {
    ...typography.h3,
    color: colors.textInverse,
  },
  heroMetricLabel: {
    ...typography.caption,
    color: alpha(colors.textInverse, 0.7),
    marginTop: 2,
  },
  greetingText: {
    ...typography.h1,
    color: colors.textInverse,
  },
  greetingSubtitle: {
    ...typography.bodySmall,
    color: alpha(colors.textInverse, 0.72),
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
  },
  activityList: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    gap: spacing.base,
    ...shadows.soft,
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
    backgroundColor: colors.accent,
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

