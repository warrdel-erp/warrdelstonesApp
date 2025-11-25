import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { TempScreen } from '../../../screens/TempScreen.tsx';
import { CustomersScreen } from '../../../screens/customers/CustomersScreen.tsx';
import { AddCustomerScreen } from '../../../screens/customers/AddCustomerScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.CUSTOMERS,
    title: 'All Customers',
    parentStack: 'Directory',
    component: CustomersScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
  {
    id: ScreenId.ADD_CUSTOMERS,
    title: 'Add Customer',
    parentStack: 'Directory',
    component: AddCustomerScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
];
export const CustomersNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Customers', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
