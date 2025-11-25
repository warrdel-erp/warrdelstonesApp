import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ScreenProvider } from '../context/ScreenContext';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { useAuthContext } from '../context/AuthContext';
import {
  DrawerMenuItem,
  ADMIN_DRAWER_CONFIG,
} from './navigationConstants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../theme';
import { Platform } from 'react-native';

const Drawer = createDrawerNavigator();

const mapDrawerItemToNavigator: React.Component = (item: DrawerMenuItem) => {
  return <Drawer.Screen key={item.id} name={item.id} component={item.component!!} />;
};

const registeredNavigators: React.Component[] = ADMIN_DRAWER_CONFIG.map(item => {
  if (item.component) {
    return mapDrawerItemToNavigator(item);
  } else if ((item.children?.length || 0) > 0) {
    return item.children?.flatMap(child => mapDrawerItemToNavigator(child));
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
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          sceneStyle: {
            backgroundColor: theme.colors.primaryDark,
            paddingTop: insets.top,
            paddingBottom: Platform.OS === 'ios' ? 0 : insets.bottom,
          },
          headerShown: false,
        }}>
        {registeredNavigators}
      </Drawer.Navigator>
    </ScreenProvider>
  );
};

export default StaffNavigator;
