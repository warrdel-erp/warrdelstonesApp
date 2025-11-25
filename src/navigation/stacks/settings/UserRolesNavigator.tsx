import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { INVENTORY_SCREENS } from '../inventory/InventoryNavigator.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.USER_ROLES,
    title: 'All User Roles',
    parentStack: 'Settings',
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];

export const UserRolesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'User Roles', screen.title),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
