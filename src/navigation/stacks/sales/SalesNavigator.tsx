import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddSalesOrderScreen from '../../../screens/sales/AddSalesOrderScreen.tsx';
import { SalesOrdersScreen } from '../../../screens/sales/SalesOrdersScreen.tsx';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';

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
  {
    id: ScreenId.ADD_SALES_ORDER,
    title: 'Create Sales Order',
    parentStack: 'Sales',
    component: AddSalesOrderScreen,
    roles: ALL_ROLES,
    isRoot: false,
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
