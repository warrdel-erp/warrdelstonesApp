import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.VENDORS,
    title: 'Vendors',
    parentStack: 'Initiate',
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];
export const VendorsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Vendors', screen.title),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
