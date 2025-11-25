import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createHeaderComponent } from '../../headerFactory.tsx';
import { ALL_ROLES, ScreenId, ScreenItem } from '../../navigationConstants.ts';
import { ProductsScreen } from '../../../screens/products/ProductsScreen.tsx';
import { AddProductScreen } from '../../../screens/products/AddProductScreen.tsx';

const Stack = createStackNavigator();

const SCREENS: ScreenItem[] = [
  {
    id: ScreenId.PRODUCTS,
    title: 'All Products',
    parentStack: 'Initiate',
    component: ProductsScreen,
    roles: ALL_ROLES,
    isRoot: true,
  },
  {
    id: ScreenId.ADD_PRODUCT,
    title: 'Add New Product',
    parentStack: 'Initiate',
    component: AddProductScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
];
export const ProductsNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      {SCREENS.map(screen => (
        <Stack.Screen
          name={screen.id}
          key={screen.title}
          component={screen.component}
          options={{
            header: createHeaderComponent(screen.id,  'Products', screen.title),
          }}
        />
      ))}
    </Stack.Navigator>
  );
};
