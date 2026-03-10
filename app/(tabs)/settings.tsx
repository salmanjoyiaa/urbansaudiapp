import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/theme';
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
    <View style={styles.container}>
      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={64} color={colors.primary} />
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Admin'}</Text>
        <Text style={styles.email}>{profile?.email || ''}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>ADMIN</Text>
        </View>
      </Card>

      {/* Info */}
      <Card style={{ marginTop: spacing.base }}>
        <View style={styles.infoRow}>
          <Ionicons name="phone-portrait-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoLabel}>Joined</Text>
          <Text style={styles.infoValue}>
            {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
          </Text>
        </View>
      </Card>

      {/* App Info */}
      <Card style={{ marginTop: spacing.base }}>
        <View style={styles.infoRow}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="globe-outline" size={18} color={colors.textMuted} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.base,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    marginBottom: spacing.md,
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
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  roleText: {
    ...typography.label,
    color: colors.primary,
    fontSize: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  logoutContainer: {
    marginTop: 'auto',
    paddingBottom: spacing['2xl'],
  },
});
