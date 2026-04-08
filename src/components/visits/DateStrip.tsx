import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { isToday, parseISO } from 'date-fns';
import { colors, spacing, borderRadius, typography } from '@/theme';
import { PressableScale } from '@/components/ui/PressableScale';
import { formatDayName, formatDayNumber, getDateRange } from '@/utils/format';

interface DateStripProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

/**
 * Horizontal scrolling date picker strip.
 * Selected date highlighted in primary; today dot in amber accent.
 */
export function DateStrip({ selectedDate, onDateSelect }: DateStripProps) {
  const scrollRef = useRef<ScrollView>(null);
  const dates = getDateRange(selectedDate, 7, 14);

  // Scroll to center selected date
  useEffect(() => {
    const index = dates.indexOf(selectedDate);
    if (index >= 0 && scrollRef.current) {
      const offset = Math.max(0, index * 72 - 120);
      setTimeout(() => scrollRef.current?.scrollTo({ x: offset, animated: false }), 100);
    }
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {dates.map((date) => {
        const isSelected = date === selectedDate;
        const today = isToday(parseISO(date));

        return (
          <PressableScale
            key={date}
            onPress={() => onDateSelect(date)}
            style={[
              styles.dateItem,
              isSelected && styles.dateItemSelected,
              today && !isSelected && styles.dateItemToday,
            ]}
          >
            <Text
              style={[
                styles.dayName,
                isSelected && styles.selectedText,
              ]}
            >
              {formatDayName(date)}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                isSelected && styles.selectedText,
                today && !isSelected && styles.todayText,
              ]}
            >
              {formatDayNumber(date)}
            </Text>
            {today && (
              <View style={[styles.todayDot, isSelected && { backgroundColor: colors.textInverse }]} />
            )}
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  dateItem: {
    width: 56,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateItemSelected: {
    backgroundColor: colors.primary,
  },
  dateItemToday: {
    backgroundColor: colors.accentLight,
  },
  dayName: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  dayNumber: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.textInverse,
  },
  todayText: {
    color: colors.accent,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 1,
  },
});
