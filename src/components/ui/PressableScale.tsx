import React, { useCallback } from 'react';
import { Pressable, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { animation } from '@/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Scale factor on press. Default: 0.97 */
  activeScale?: number;
  /** Opacity on press. Default: 0.85 */
  activeOpacity?: number;
  /** Hit slop around the pressable area */
  hitSlop?: number;
}

/**
 * Animated pressable wrapper with subtle scale + opacity micro-interaction.
 * Uses Reanimated for 60fps native-thread animations.
 *
 * Usage:
 * ```tsx
 * <PressableScale onPress={handleTap}>
 *   <Card>...</Card>
 * </PressableScale>
 * ```
 */
export function PressableScale({
  children,
  onPress,
  onLongPress,
  disabled = false,
  style,
  activeScale = animation.pressScale,
  activeOpacity = animation.pressOpacity,
  hitSlop = 0,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const timingConfig = {
    duration: animation.fast,
    easing: Easing.out(Easing.quad),
  };

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(activeScale, timingConfig);
    opacity.value = withTiming(activeOpacity, timingConfig);
  }, [activeScale, activeOpacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, timingConfig);
    opacity.value = withTiming(1, timingConfig);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      hitSlop={hitSlop}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
