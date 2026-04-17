import React, { memo, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate } from '../utils/dateFormatter';

interface ArticleCardProps {
  url: string;
  title: string;
  sourceName: string;
  publishedAt: string;
  imageUrl: string | null;
  onPress: (url: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  url,
  title,
  sourceName,
  publishedAt,
  imageUrl,
  onPress,
}) => {
  const handlePress = useCallback(() => {
    onPress(url);
  }, [onPress, url]);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>{title}</Text>
        <View style={styles.footer}>
          <Text style={styles.source} numberOfLines={1}>{sourceName}</Text>
          <Text style={styles.date}>{formatDate(publishedAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    height: 120,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  source: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default memo(ArticleCard);