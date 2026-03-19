import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddLoadingOrderScreen from '../../../screens/sales/AddLoadingOrderScreen.tsx';
import AddPackagingListScreen from '../../../screens/sales/AddPackagingListScreen.tsx';
import AddSalesOrderScreen from '../../../screens/sales/AddSalesOrderScreen.tsx';
import InvoiceDetailScreen from '../../../screens/sales/InvoiceDetailScreen.tsx';
import LoadingOrderDetailScreen from '../../../screens/sales/LoadingOrderDetailScreen.tsx';
import PackagingListDetailScreen from '../../../screens/sales/PackagingListDetailScreen.tsx';
import SalesOrderDetailScreen from '../../../screens/sales/SalesOrderDetailScreen.tsx';
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
  {
    id: ScreenId.SALES_ORDER_DETAIL,
    title: 'Sales Order Detail',
    parentStack: 'Sales',
    component: SalesOrderDetailScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.ADD_LOADING_ORDER,
    title: 'Add Loading Order',
    parentStack: 'Sales',
    component: AddLoadingOrderScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.LOADING_ORDER_DETAIL,
    title: 'Loading Order Details',
    parentStack: 'Sales',
    component: LoadingOrderDetailScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.ADD_PACKAGING_LIST,
    title: 'New Packaging List',
    parentStack: 'Sales',
    component: AddPackagingListScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.PACKAGING_LIST_DETAIL,
    title: 'Packaging List Details',
    parentStack: 'Sales',
    component: PackagingListDetailScreen,
    roles: ALL_ROLES,
    isRoot: false,
  },
  {
    id: ScreenId.INVOICE_DETAIL,
    title: 'Invoice Details',
    parentStack: 'Sales',
    component: InvoiceDetailScreen,
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
