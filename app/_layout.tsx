import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/services/supabase';
import { getProfile } from '@/services/auth';
import { registerForPushNotifications, addNotificationResponseListener } from '@/services/pushNotifications';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { colors } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10_000,
      retry: 2,
    },
  },
});

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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <StatusBar style="light" />
          <AuthGate />
        </ErrorBoundary>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
