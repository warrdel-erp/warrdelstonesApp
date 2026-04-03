import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { HomeScreen } from '../../../screens';
import { TempScreen } from '../../../screens/TempScreen.tsx';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ScreenId } from '../../navigationConstants.ts';

const HomeStack = createStackNavigator();

export const DashboardNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name={ScreenId.HOME}
        component={HomeScreen}
        options={{
          header: createHeaderComponent(ScreenId.HOME),
        }}
      />
      <HomeStack.Screen
        name={ScreenId.NOTICE_BOARD}
        component={TempScreen}
        options={{
          header: createHeaderComponent(ScreenId.NOTICE_BOARD, 'Notice Board', 'Dashboard', false),
        }}
      />
    </HomeStack.Navigator>
  );
};
