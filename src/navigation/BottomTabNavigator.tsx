import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Box, ClipboardList, LayoutGrid } from '@tamagui/lucide-icons';
import { BodyText } from '../components/ui';
import theme from '../theme';

// Screen imports
import HomeScreen from '../screens/dashboard/HomeScreen';
import { MoreScreen } from '../screens/more/MoreScreen';

// Stack navigators for tab screens
import { SalesNavigator } from './stacks/sales/SalesNavigator';
import { InventoryNavigator } from './stacks/inventory/InventoryNavigator';

const Tab = createBottomTabNavigator();

// Tab configuration
const TABS = [
  {
    name: 'HomeTab',
    label: 'Home',
    Icon: Home,
    component: HomeScreen,
  },
  {
    name: 'OrdersTab',
    label: 'Orders',
    Icon: ClipboardList,
    component: SalesNavigator,
  },
  {
    name: 'InventoryTab',
    label: 'Inventory',
    Icon: Box,
    component: InventoryNavigator,
  },
  {
    name: 'MoreTab',
    label: 'More',
    Icon: LayoutGrid,
    component: MoreScreen,
  },
];

// Custom Tab Bar component
const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

  return (
    <View style={styles.tabBarOuter}>
      {/* Frosted glass card */}
      <View style={styles.tabBarInner}>
        {TABS.map((tab, index) => {
          const isFocused = state.index === index;
          const { Icon } = tab;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index]?.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              id={`tab-${tab.name.toLowerCase()}`}
              onPress={onPress}
              activeOpacity={0.75}
              style={styles.tabItem}>
              {/* Active indicator pill */}
              {isFocused && <View style={styles.activePill} />}

              {/* Icon container */}
              <View
                style={[
                  styles.iconWrap,
                  isFocused && styles.iconWrapActive,
                ]}>
                <Icon
                  size={22}
                  color={isFocused ? theme.colors.white : '#94A3B8'}
                />
              </View>

              {/* Label */}
              <BodyText
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}>
                {tab.label}
              </BodyText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  tabBarInner: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
    // Subtle border
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    position: 'relative',
    paddingVertical: 2,
  },
  activePill: {
    position: 'absolute',
    top: -8,
    width: 32,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.primary,
  },
  iconWrap: {
    width: 40,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.bold,
  },
  tabLabelInactive: {
    color: '#94A3B8',
  },
});

export default BottomTabNavigator;
