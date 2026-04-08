import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, alpha, spacing, borderRadius, typography, animation } from '@/theme';
import { Button } from '@/components/ui/Button';
import { AppInput } from '@/components/ui/AppInput';
import { signIn } from '@/services/auth';
import { useAuthStore } from '@/store/authStore';

/**
 * Login screen — "Midnight Concierge" branded
 * Professional auth gate with staggered entrance animation,
 * Outfit headings, DM Sans body, warm amber accents.
 *
 * OWASP: Input validation on form fields. No credentials in code.
 * Error messages are user-friendly without backend details.
 */
export default function LoginScreen() {
  const router = useRouter();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Staggered entrance animation
  const fadeIcon = useRef(new Animated.Value(0)).current;
  const fadeBrand = useRef(new Animated.Value(0)).current;
  const fadeForm = useRef(new Animated.Value(0)).current;
  const fadeFooter = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeIcon, { toValue: 1, duration: animation.slow, useNativeDriver: true }),
        Animated.timing(slideUp, { toValue: 0, duration: animation.slow, useNativeDriver: true }),
      ]),
      Animated.timing(fadeBrand, { toValue: 1, duration: animation.slow, useNativeDriver: true }),
      Animated.timing(fadeForm, { toValue: 1, duration: animation.slow, useNativeDriver: true }),
      Animated.timing(fadeFooter, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // OWASP: Input validation
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { profile } = await signIn(email.trim(), password);
      setAuthenticated(profile);
      router.replace('/(tabs)');
    } catch (err: unknown) {
      // OWASP: User-friendly error without backend exposure
      const message = err instanceof Error ? err.message : 'Login failed';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bgOrbOne} />
        <View style={styles.bgOrbTwo} />
        <View style={styles.bgGrid} />

        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.topBadgeWrap, { opacity: fadeIcon, transform: [{ translateY: slideUp }] }]}> 
            <View style={styles.topBadge}>
              <View style={styles.topBadgeDot} />
              <Text style={styles.topBadgeText}>Private admin access</Text>
            </View>
          </Animated.View>

          {/* Logo Icon */}
          <Animated.View style={[styles.logoContainer, { opacity: fadeIcon, transform: [{ translateY: slideUp }] }]}> 
            <View style={styles.logoIcon}>
              <Text style={styles.logoLetter}>U</Text>
            </View>
            <View style={styles.logoRing} />
          </Animated.View>

          {/* Branding */}
          <Animated.View style={[styles.branding, { opacity: fadeBrand }]}>
            <Text style={styles.brandName}>UrbanSaudi</Text>
            <View style={styles.accentBar} />
            <Text style={styles.subtitle}>
              Property management, elevated.
            </Text>
            <Text style={styles.brandDescription}>
              Secure access for the concierge team managing luxury visit workflows.
            </Text>
          </Animated.View>
          {/* Form Card */}
          <Animated.View style={[styles.formCard, { opacity: fadeForm }]}> 
            <AppInput
              label="EMAIL ADDRESS"
              value={email}
              onChangeText={setEmail}
              placeholder="admin@urbansaudi.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />

            <AppInput
              label="PASSWORD"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
            />

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={{ marginTop: spacing.sm }}
            />
          </Animated.View>

          <Animated.View style={[styles.securityPanel, { opacity: fadeFooter }]}> 
            <View style={styles.securityRow}>
              <View style={styles.securityBadge}>
                <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} />
                <Text style={styles.securityText}>ENCRYPTED SIGN-IN</Text>
              </View>
              <View style={styles.securityBadge}>
                <Ionicons name="shield-checkmark-outline" size={13} color={colors.textMuted} />
                <Text style={styles.securityText}>AUTHORIZED ACCESS</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.footerPill}>
                <Text style={styles.footerPillText}>VISITS</Text>
              </View>
              <View style={styles.footerPill}>
                <Text style={styles.footerPillText}>NOTIFICATIONS</Text>
              </View>
              <View style={styles.footerPill}>
                <Text style={styles.footerPillText}>PROPERTY SYNC</Text>
              </View>
            </View>

            <Text style={styles.footer}>
              © 2026 URBAN REAL ESTATE SAUDI. ALL RIGHTS RESERVED.
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  bgOrbOne: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: alpha(colors.accent, 0.10),
  },
  bgOrbTwo: {
    position: 'absolute',
    bottom: 60,
    left: -140,
    width: 320,
    height: 320,
    borderRadius: 320,
    backgroundColor: alpha(colors.primary, 0.08),
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.08,
    borderColor: colors.borderLight,
    borderWidth: 1,
    borderStyle: 'dashed',
    margin: spacing.md,
    borderRadius: borderRadius.xl,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
    paddingBottom: spacing['3xl'],
    justifyContent: 'center',
    gap: spacing.lg,
  },
  topBadgeWrap: {
    alignItems: 'center',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: colors.accent,
  },
  topBadgeText: {
    ...typography.label,
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A0F1E',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    zIndex: 2,
  },
  logoRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 96,
    borderWidth: 1,
    borderColor: alpha(colors.accent, 0.22),
  },
  logoIconInner: {
    position: 'absolute',
    inset: 0,
  },
  logoLetter: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -1,
  },
  branding: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  brandName: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  accentBar: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  brandDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 320,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#0A0F1E',
    shadowOpacity: 0.05,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  securityPanel: {
    gap: spacing.lg,
    paddingVertical: spacing.xs,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  securityText: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  footerPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: alpha(colors.primary, 0.05),
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  footerPillText: {
    ...typography.label,
    fontSize: 9,
    color: colors.primary,
    letterSpacing: 1,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
