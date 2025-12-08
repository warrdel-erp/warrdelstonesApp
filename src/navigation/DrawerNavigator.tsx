import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { useAuthContext } from '../context/AuthContext';
import { ScreenProvider } from '../context/ScreenContext';
import theme from '../theme';
import { ADMIN_DRAWER_CONFIG, DrawerMenuItem } from './navigationConstants';

const Drawer = createDrawerNavigator();

const mapDrawerItemToNavigator = (item: DrawerMenuItem): React.ReactNode => {
  return <Drawer.Screen key={item.id} name={item.id} component={item.component!!} />;
};

const registeredNavigators: React.ReactNode[] = ADMIN_DRAWER_CONFIG.map(item => {

  if (item.component) {
    return mapDrawerItemToNavigator(item);
  } else if ((item.children?.length || 0) > 0) {
    return item.children?.flatMap(child => mapDrawerItemToNavigator(child));
  }

});

const DrawerNavigator: React.FC = () => {
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

export default DrawerNavigator;
