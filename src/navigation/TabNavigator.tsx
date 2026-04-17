import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';
import HomeStack from './HomeStack';
import BookmarksScreen from '../screens/BookmarksScreen';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName = route.name === 'HomeTab' ? '📰' : '🔖';
          return <Text style={{ fontSize: 20, color: focused ? '#0066cc' : color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="BookmarksTab" 
        component={BookmarksScreen} 
        options={{ 
          title: 'Bookmarks',
          headerShown: true,
          tabBarLabel: 'Bookmarks' 
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;