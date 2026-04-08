import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '@/theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadiusOverride?: number;
  style?: ViewStyle;
}

/**
 * Pulsing skeleton placeholder with smooth opacity animation.
 * Uses warm shimmer color to match the Midnight Concierge palette.
 */
export function Skeleton({ width, height, borderRadiusOverride, style }: SkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0.35, duration: 900, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: borderRadiusOverride ?? borderRadius.md,
          backgroundColor: colors.shimmer,
          opacity: shimmerAnim,
        },
        style,
      ]}
    />
  );
}

/** Skeleton matching a VisitCard layout */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[skeletonStyles.card, style]}>
      <View style={skeletonStyles.topRow}>
        <Skeleton width="55%" height={16} />
        <Skeleton width={56} height={24} borderRadiusOverride={borderRadius.sm} />
      </View>
      <View style={{ height: spacing.sm }} />
      <Skeleton width="70%" height={14} />
      <View style={{ height: spacing.sm }} />
      <View style={skeletonStyles.bottomRow}>
        <Skeleton width={72} height={22} borderRadiusOverride={borderRadius.full} />
        <Skeleton width={90} height={14} />
      </View>
    </View>
  );
}

/** Skeleton matching a StatCard layout */
export function SkeletonStatCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[skeletonStyles.statCard, style]}>
      <Skeleton width={40} height={40} borderRadiusOverride={borderRadius.md} />
      <View style={{ height: spacing.md }} />
      <Skeleton width="40%" height={24} />
      <View style={{ height: spacing.xs }} />
      <Skeleton width="70%" height={12} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    ...shadows.soft,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    ...shadows.soft,
    flex: 1,
  },
});
