import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { INVENTORY_SCREENS } from '../inventory/InventoryNavigator.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { TempScreen } from '../../../screens/TempScreen.tsx';
import { SuppliersScreen } from '../../../screens/suppliers/SuppliersScreen.tsx';
import { AddSupplierScreen } from '../../../screens/suppliers/AddSupplierScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.SUPPLIERS,
    title: 'All Suppliers',
    parentStack: 'Directory',
    component: SuppliersScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
  {
    id: ScreenId.ADD_SUPPLIER,
    title: 'Add Supplier',
    parentStack: 'Directory',
    component: AddSupplierScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
];

export const SuppliersNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Suppliers', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
