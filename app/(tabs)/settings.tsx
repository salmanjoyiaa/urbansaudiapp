import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, ambientShadow } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, reset } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } catch {
            // ignore
          }
          reset();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.textInverse} />
          </View>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Admin'}</Text>
        <Text style={styles.email}>{profile?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>ADMIN</Text>
        </View>
      </Card>

      {/* Info */}
      <Card style={styles.sectionCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="phone-portrait-outline" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
        </View>
        <View style={styles.infoGap} />
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="time-outline" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
          </Text>
        </View>
      </Card>

      {/* App Info */}
      <Card style={styles.sectionCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="information-circle-outline" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoGap} />
        <View style={styles.infoRow}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="globe-outline" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.infoLabel}>Timezone</Text>
          <Text style={styles.infoValue}>Asia/Riyadh (UTC+3)</Text>
        </View>
      </Card>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="destructive"
          size="lg"
          icon={<Ionicons name="log-out-outline" size={18} color="#FFF" />}
          style={{ width: '100%' }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing['4xl'],
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  sectionCard: {
    marginTop: spacing.base,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  email: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  roleBadge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondaryLight,
  },
  roleText: {
    ...typography.label,
    color: colors.secondary,
    fontSize: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  infoGap: {
    height: spacing.base,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: spacing['3xl'],
  },
});
