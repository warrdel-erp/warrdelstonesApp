import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { createHeaderComponent } from '../../headerFactory.tsx';
import InventoryScreen from '../../../screens/inventory/InventoryScreen.tsx';
import ProductDetailScreen from '../../../screens/inventory/ProductDetailScreen.tsx';
import { BundleSlabsListScreen } from '../../../screens/inventory/BundleSlabsListScreen.tsx';
import { BlockSlabsListScreen } from '../../../screens/inventory/BlockSlabsListScreen.tsx';

const Stack = createStackNavigator();

export const INVENTORY_SCREENS: ScreenItem[] = [
  {
    id: ScreenId.INVENTORY,
    title: 'All Inventory',
    component: InventoryScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
  {
    id: ScreenId.PRODUCT_DETAIL,
    title: 'Product Detail',
    component: ProductDetailScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.SLABS_LIST,
    title: 'Slabs List',
    component: BundleSlabsListScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.BLOCK_SLAB_LIST,
    title: 'Slabs List',
    component: BlockSlabsListScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
];
export const InventoryNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {INVENTORY_SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id, 'Inventory', screen.title, screen.isRoot),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
