import React, { useEffect, useCallback } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import { getProfile } from '@/services/auth';
import { registerForPushNotifications, addNotificationResponseListener } from '@/services/pushNotifications';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { colors, typography } from '@/theme';

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 2,
    },
  },
});

/**
 * Branded loading screen — replaces the bland ActivityIndicator.
 * Shows app name with warm amber accent bar, pulsing animation.
 */
function BrandedSplash() {
  const opacity = useSharedValue(0);
  const barWidth = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) });
    barWidth.value = withDelay(400, withTiming(64, { duration: 800, easing: Easing.out(Easing.quad) }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    width: barWidth.value,
  }));

  return (
    <View style={styles.splashContainer}>
      <Animated.View style={[styles.splashContent, containerStyle]}>
        <View style={styles.splashIcon}>
          <Text style={styles.splashIconText}>U</Text>
        </View>
        <Text style={styles.splashTitle}>UrbanSaudi</Text>
        <Text style={styles.splashSubtitle}>Admin Dashboard</Text>
        <Animated.View style={[styles.splashBar, barStyle]} />
      </Animated.View>
    </View>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, setAuthenticated, setLoading, reset } = useAuthStore();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (profile.role === 'admin') {
            setAuthenticated(profile);
          } else {
            await supabase.auth.signOut();
            reset();
          }
        } else {
          reset();
        }
      } catch {
        reset();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        reset();
      } else if (event === 'SIGNED_IN' && session.user) {
        try {
          const profile = await getProfile(session.user.id);
          if (profile.role === 'admin') {
            setAuthenticated(profile);
          } else {
            await supabase.auth.signOut();
            reset();
          }
        } catch {
          reset();
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Register push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications().catch(console.error);

      // Handle notification tap → navigate to visits or notifications
      const responseListener = addNotificationResponseListener((response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === 'visits') {
          router.push('/(tabs)/visits');
        } else {
          router.push('/(tabs)/notifications');
        }
      });

      return () => responseListener.remove();
    }
  }, [isAuthenticated]);

  // Navigation guard
  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return <BrandedSplash />;
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <BrandedSplash />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <StatusBar style="dark" />
          <AuthGate />
        </ErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  splashContent: {
    alignItems: 'center',
    gap: 8,
  },
  splashIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  splashIconText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: -1,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  splashBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 16,
  },
});
