import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.VENDOR_INVOICES,
    title: 'All Vendor Invoices',
    parentStack: "Expenses",
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
];
export const VendorInvoicesNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Vendor Invoices', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
