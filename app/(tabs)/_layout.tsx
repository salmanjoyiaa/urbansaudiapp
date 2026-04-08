import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows, typography } from '@/theme';
import { useNotificationBadge } from '@/hooks/useNotifications';

/**
 * Tab layout — warm amber active accent, custom font labels,
 * polished tab bar with soft shadow.
 */
export default function TabLayout() {
  const unreadCount = useNotificationBadge();

  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomColor: colors.borderLight,
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          ...typography.h3,
          color: colors.textPrimary,
        },
        headerTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.surfaceElevated,
          borderTopWidth: 0,
          marginHorizontal: spacing.sm,
          marginBottom: spacing.sm,
          borderRadius: 26,
          paddingBottom: spacing.sm,
          paddingTop: spacing.xs,
          height: 68,
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...shadows.medium,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          ...typography.tabLabel,
        },
        tabBarItemStyle: {
          paddingTop: spacing.xs,
          paddingBottom: spacing.xs,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'UrbanSaudi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
          headerTitle: 'Daily Visits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.error,
            fontSize: 10,
            fontWeight: '700',
            color: colors.textInverse,
            borderWidth: 0,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
