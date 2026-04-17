import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingFooterProps {
  isLoading: boolean;
}

const LoadingFooter: React.FC<LoadingFooterProps> = ({ isLoading }) => {
  if (!isLoading) return <View style={styles.empty} />;
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#0066cc" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    height: 20,
  },
});

export default LoadingFooter;