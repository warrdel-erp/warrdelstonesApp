import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { createHeaderComponent } from '../../headerFactory.tsx';
import ProfileScreen from '../../../screens/profile/ProfileScreen.tsx';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

export const INVOICES_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.INVOICES_LIST,
    title: 'All Invoices',
    parentStack: 'Invoices',
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: true,
  }
];

export const InvoicesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {INVOICES_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(
              screen.id,
              'Invoices',
              screen.title,
              screen.isRoot,
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
