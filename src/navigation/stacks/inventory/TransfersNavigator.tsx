import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { createHeaderComponent } from '../../headerFactory.tsx';
import InventoryScreen from '../../../screens/inventory/InventoryScreen.tsx';
import ProductDetailScreen from '../../../screens/inventory/ProductDetailScreen.tsx';
import { BundleSlabsListScreen } from '../../../screens/inventory/BundleSlabsListScreen.tsx';
import { BlockSlabsListScreen } from '../../../screens/inventory/BlockSlabsListScreen.tsx';
import { TempScreen } from '../../../screens/TempScreen.tsx';

const Stack = createStackNavigator();

export const TRANSFERS_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.TRANSFERS,
    title: 'Slabs List',
    parentStack: "Transfers",
    component: TempScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
];
export const TransfersNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {TRANSFERS_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Transfers', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
