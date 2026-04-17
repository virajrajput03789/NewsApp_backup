import React, { useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import { formatDate } from '../utils/dateFormatter';
import { useBookmark } from '../hooks/useBookmark';

type Props = NativeStackScreenProps<HomeStackParamList, 'Detail'>;

const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { article } = route.params;
  const { isBookmarked, toggleBookmark } = useBookmark(article);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: article.source.name,
      headerRight: () => (
        <TouchableOpacity onPress={toggleBookmark} style={styles.headerButton}>
          <Text style={[styles.headerButtonText, isBookmarked && styles.bookmarkedText]}>
            {isBookmarked ? '★ Saved' : '☆ Save'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, article.source.name, isBookmarked, toggleBookmark]);

  const handleOpenSource = () => {
    if (article.url) {
      Linking.openURL(article.url).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.author}>{article.author ? `By ${article.author}` : article.source.name}</Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>

        {article.urlToImage && (
          <Image source={{ uri: article.urlToImage }} style={styles.image} resizeMode="cover" />
        )}

        <Text style={styles.description}>{article.description}</Text>
        
        {article.content && (
          <Text style={styles.content}>
            {article.content.replace(/\[\+\d+ chars\]$/, '')}
          </Text>
        )}

        <TouchableOpacity style={styles.readMoreButton} onPress={handleOpenSource}>
          <Text style={styles.readMoreText}>Read Full Article</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 12,
    lineHeight: 28,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  content: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
    marginBottom: 24,
  },
  readMoreButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    paddingHorizontal: 10,
  },
  headerButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '500',
  },
  bookmarkedText: {
    color: '#f39c12',
    fontWeight: 'bold',
  },
});

export default DetailScreen;