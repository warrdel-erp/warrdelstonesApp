import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { TempScreen } from '../../../screens/TempScreen.tsx';
import { SalesOrdersScreen } from '../../../screens/sales/SalesOrdersScreen.tsx';

const Stack = createStackNavigator();
export const SALES_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.SALES_ORDER_LIST,
    title: 'Sales orders',
    parentStack: 'Sales',
    component: SalesOrdersScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];

export const SalesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SALES_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Sales', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
