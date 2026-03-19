import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { DeliveriesScreen } from '../../../screens/sales/DeliveriesScreen.tsx';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';

const Stack = createStackNavigator();

export const DELIVERIES_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.DELIVERIES_LIST,
    title: 'All Deliveries',
    parentStack: 'Deliveries',
    component: DeliveriesScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];

export const DeliveriesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {DELIVERIES_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(
              screen.id,
              'Deliveries',
              screen.title,
              screen.isRoot,
            ),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
