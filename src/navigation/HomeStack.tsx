import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'News Headlines' }} 
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ headerBackTitle: 'Back' }} 
      />
    </Stack.Navigator>
  );
};

export default HomeStack;