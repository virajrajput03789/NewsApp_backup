import React, { memo, useCallback, useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { formatDate } from '../utils/dateFormatter';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

interface ArticleCardProps {
  url: string;
  title: string;
  sourceName: string;
  publishedAt: string;
  imageUrl: string | null;
  onPress: (url: string) => void;
  index?: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  url,
  title,
  sourceName,
  publishedAt,
  imageUrl,
  onPress,
  index = 0,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const imageFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: Math.min(index * 100, 1000),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: Math.min(index * 100, 1000),
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const onImageLoad = () => {
    Animated.timing(imageFade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = useCallback(() => {
    onPress(url);
  }, [onPress, url]);

  return (
    <Animated.View 
      style={[
        styles.cardContainer, 
        { 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }] 
        }
      ]}
    >
      <TouchableOpacity 
        style={[styles.container, isPressed && styles.containerPressed]} 
        onPress={handlePress} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageWrapper}>
          {imageUrl ? (
            <Animated.Image 
              source={{ uri: imageUrl }} 
              style={[styles.image, { opacity: imageFade }]} 
              resizeMode="cover"
              onLoad={onImageLoad}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderIcon}>📰</Text>
            </View>
          )}
          <View style={[styles.imagePlaceholder, { position: 'absolute', zIndex: -1 }]} />
        </View>

        <View style={styles.content}>
          <View>
            <Text style={styles.source} numberOfLines={1}>{sourceName.toUpperCase()}</Text>
            <Text style={styles.title} numberOfLines={3}>{title}</Text>
          </View>
          <Text style={styles.date}>{formatDate(publishedAt)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
    borderRadius: 20,
    overflow: 'hidden',
    height: 128,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 16,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  containerPressed: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary + '30',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageWrapper: {
    width: 110,
    height: '100%',
    backgroundColor: COLORS.placeholder,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.placeholder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 28,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    paddingRight: SPACING.lg,
    justifyContent: 'space-between',
  },
  source: {
    ...TYPOGRAPHY.label,
    fontSize: 10,
    color: COLORS.primary,
    marginBottom: 6,
    fontWeight: '800',
  },
  title: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },
  date: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
});

export default memo(ArticleCard);