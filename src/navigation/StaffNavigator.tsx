import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ScreenProvider } from '../context/ScreenContext';
import { useAuthContext } from '../context/AuthContext';
import {
  DrawerMenuItem,
  ADMIN_DRAWER_CONFIG,
} from './navigationConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';
import { BottomTabNavigator } from './BottomTabNavigator';

const Stack = createStackNavigator();

const mapItemToNavigator = (item: DrawerMenuItem) => {
  return <Stack.Screen key={item.id} name={item.id} component={item.component!!} />;
};

const registeredNavigators: any[] = [];
ADMIN_DRAWER_CONFIG.forEach(item => {
  if (item.component) {
    registeredNavigators.push(mapItemToNavigator(item));
  } else if ((item.children?.length || 0) > 0) {
    item.children?.forEach(child => {
      registeredNavigators.push(mapItemToNavigator(child));
    });
  }
});

const StaffNavigator: React.FC = () => {
  const { authState } = useAuthContext();
  const insets = useSafeAreaInsets();

  if (!authState) {
    return null;
  }

  return (
    <ScreenProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
        }}>
        {/* Main App interface with Bottom Tabs */}
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        
        {/* Register all individual module stacks previously in the drawer */}
        {registeredNavigators}
      </Stack.Navigator>
    </ScreenProvider>
  );
};

export default StaffNavigator;
