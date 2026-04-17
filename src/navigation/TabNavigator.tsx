import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import HomeStack from './HomeStack';
import BookmarksScreen from '../screens/BookmarksScreen';
import { Text, View, Platform, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../utils/theme';

const Tab = createBottomTabNavigator<TabParamList>();

const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  return (
    <View style={styles.iconContainer}>
      <Text style={[
        styles.icon, 
        { 
          opacity: focused ? 1 : 0.4,
          transform: [{ scale: focused ? 1.2 : 1 }]
        }
      ]}>
        {name === 'HomeTab' ? '📰' : '🔖'}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ tabBarLabel: 'Headlines' }} 
      />
      <Tab.Screen 
        name="BookmarksTab" 
        component={BookmarksScreen} 
        options={{ 
          title: 'Saved',
          headerShown: true,
          tabBarLabel: 'Saved',
          headerStyle: { 
            backgroundColor: COLORS.surface,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: { 
            fontWeight: '800', 
            color: COLORS.text,
            fontSize: 24,
          },
          headerTitleAlign: 'left',
          headerLeftContainerStyle: { paddingLeft: SPACING.lg },
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 94 : 70,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 30,
  },
  icon: {
    fontSize: 22,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: -12,
  },
});

export default TabNavigator;