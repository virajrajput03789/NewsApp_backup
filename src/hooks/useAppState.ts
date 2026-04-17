import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = (onForeground?: () => void) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        if (onForeground) {
          onForeground();
        }
      }

      console.log('AppState transition:', appState.current, '->', nextAppState);
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [onForeground]);

  return appStateVisible;
};