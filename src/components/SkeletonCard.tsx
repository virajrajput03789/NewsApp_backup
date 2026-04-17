import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const SkeletonCard = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [shimmerValue]);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.cardContainer}>
      <View style={styles.container}>
        <Animated.View style={[styles.image, { opacity }]} />
        <View style={styles.content}>
          <View>
            <Animated.View style={[styles.source, { opacity }]} />
            <Animated.View style={[styles.title, { opacity }]} />
            <Animated.View style={[styles.titleShort, { opacity }]} />
          </View>
          <Animated.View style={[styles.date, { opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    height: 120,
  },
  image: {
    width: 100,
    height: '100%',
    backgroundColor: COLORS.placeholder,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  source: {
    width: 60,
    height: 8,
    backgroundColor: COLORS.placeholder,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  title: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.placeholder,
    borderRadius: 6,
    marginBottom: SPACING.xs,
  },
  titleShort: {
    width: '70%',
    height: 12,
    backgroundColor: COLORS.placeholder,
    borderRadius: 6,
  },
  date: {
    width: 80,
    height: 8,
    backgroundColor: COLORS.placeholder,
    borderRadius: 4,
    marginTop: SPACING.md,
  },
});

export default SkeletonCard;