import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '@/theme';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadiusOverride?: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, borderRadiusOverride, style }: SkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius: borderRadiusOverride ?? borderRadius.md,
          backgroundColor: colors.shimmer,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[skeletonStyles.card, style]}>
      <Skeleton width="40%" height={14} />
      <View style={{ height: spacing.sm }} />
      <Skeleton width="70%" height={20} />
      <View style={{ height: spacing.sm }} />
      <Skeleton width="50%" height={12} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.base,
  },
});
