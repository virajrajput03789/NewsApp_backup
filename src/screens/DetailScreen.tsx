import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Share, Animated, Easing, Platform, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { formatDate } from '../utils/dateFormatter';
import { useBookmark } from '../hooks/useBookmark';
import { COLORS, SPACING, TYPOGRAPHY } from '../utils/theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { article } = route.params;
  const { isBookmarked, toggleBookmark } = useBookmark(article);
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const imageScale = useRef(new Animated.Value(1.2)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(0.5)),
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, imageScale, contentOpacity]);

  const headerBtnBg = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: ['rgba(255,255,255,0.7)', 'rgba(255,255,255,1)'],
    extrapolate: 'clamp',
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [-100, 0, 400],
    outputRange: [50, 0, -50],
    extrapolate: 'clamp',
  });

  const contentTranslateY = scrollY.interpolate({
    inputRange: [0, 400],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });

  const onShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nRead more at: ${article.url}`,
        url: article.url,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerLeft: () => (
        <Animated.View style={[styles.headerBtnContainer, { backgroundColor: headerBtnBg }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Text style={[styles.headerIcon, { fontSize: 22, marginTop: -2 }]}>‹</Text>
          </TouchableOpacity>
        </Animated.View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <Animated.View style={[styles.headerBtnContainer, { backgroundColor: headerBtnBg }]}>
            <TouchableOpacity onPress={onShare} style={styles.headerBtn}>
              <Text style={[styles.headerIcon, { fontSize: 18 }]}>📤</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.headerBtnContainer, { backgroundColor: headerBtnBg, marginLeft: 12 }]}>
            <TouchableOpacity onPress={toggleBookmark} style={styles.headerBtn}>
              <Text style={[styles.headerIcon, isBookmarked && styles.bookmarked]}>
                {isBookmarked ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ),
    });
  }, [navigation, isBookmarked, headerBtnBg]);

  const readTime = Math.ceil((article.content?.length || 500) / 1000) + 2;

  return (
    <View style={styles.fullContainer}>
      
      <Animated.ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[
          styles.imageContainer, 
          { 
            transform: [
              { scale: imageScale },
              { translateY: imageTranslateY }
            ] 
          }
        ]}>
          {article.urlToImage ? (
            <Image source={{ uri: article.urlToImage }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.placeholderIcon}>📰</Text>
            </View>
          )}
          <View style={styles.imageOverlay} />
        </Animated.View>

        <Animated.View style={[
          styles.mainContent, 
          { 
            opacity: fadeAnim, 
            transform: [
              { translateY: Animated.add(slideAnim, contentTranslateY) }
            ] 
          }
        ]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{article.source.name.toUpperCase()}</Text>
          </View>
          
          <Text style={styles.title}>{article.title}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.authorSection}>
              <View style={styles.authorAvatar}>
                <Text style={styles.avatarText}>{article.author?.[0] || article.source.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.authorName}>{article.author || article.source.name}</Text>
                <Text style={styles.readTime}>{formatDate(article.publishedAt)} • {readTime} min read</Text>
              </View>
            </View>
          </View>

          <Animated.View style={{ opacity: contentOpacity }}>
            <Text style={styles.description}>{article.description}</Text>
            
            {article.content && (
              <Text style={styles.content}>
                {article.content.replace(/\[\+\d+ chars\]$/, '')}
                ... Complete coverage of this story continues on the official news site.
              </Text>
            )}

            <TouchableOpacity 
              style={styles.fullArticleButton} 
              onPress={() => Linking.openURL(article.url)}
              activeOpacity={0.8}
            >
              <Text style={styles.fullArticleText}>Read Full Article</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  imageContainer: {
    width: '100%',
    height: 440,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.placeholder,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
    opacity: 0.2,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  mainContent: {
    marginTop: -40,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: SPACING.xl,
    paddingTop: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  badge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SPACING.lg,
  },
  badgeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 36,
    marginBottom: SPACING.xl,
  },
  metaContainer: {
    marginBottom: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.xl,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '10',
  },
  avatarText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 20,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  readTime: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  description: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    fontWeight: '600',
    lineHeight: 28,
  },
  content: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 28,
    marginBottom: SPACING.xxl,
  },
  fullArticleButton: {
    backgroundColor: COLORS.text,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.text,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fullArticleText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerBtnContainer: {
    borderRadius: 21,
    overflow: 'hidden',
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  headerRight: {
    flexDirection: 'row',
    marginRight: 10,
  },
  headerIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  bookmarked: {
    color: COLORS.warning,
  },
});

export default DetailScreen;