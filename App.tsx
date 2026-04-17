import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { loadBookmarks } from './src/utils/storage';
import { hydrate } from './src/store/bookmarksSlice';
import { loadCachedArticlesThunk } from './src/store/articlesSlice';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { ToastProvider } from './src/hooks/useToast';
import { COLORS } from './src/utils/theme';

const AppContent = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedBookmarks = await loadBookmarks();
        store.dispatch(hydrate(savedBookmarks));
        await store.dispatch(loadCachedArticlesThunk());
      } catch (error) {
        console.error('Failed to initialize app', error);
      } finally {
        setIsReady(true);
      }
    };

    initApp();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;