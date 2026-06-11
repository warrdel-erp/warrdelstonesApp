import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../../../screens/dashboard/HomeScreen';
import { ScreenId } from '../../navigationConstants.ts';

const HomeStack = createStackNavigator();

export const DashboardNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name={ScreenId.HOME}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
};
