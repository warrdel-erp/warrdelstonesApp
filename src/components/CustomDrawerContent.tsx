import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthContext } from '../context/AuthContext';
import NavigationService from '../navigation/NavigationService';
import {
  DrawerMenuItem,
  getNavigationItemsByRole
} from '../navigation/navigationConstants';
import { useAuthState } from '../store/hooks.ts';
import { textStyles, theme } from '../theme';
import { UserRole, UserRoleValue } from '../types/userTypes.ts';
import { Caption, Heading6 } from './ui';
import IconButton from './ui/IconButton.tsx';

interface ExpandableMenuItemProps {
  item: DrawerMenuItem;
  navigation: any;
  level?: number;
  parent?: DrawerMenuItem | null;
}

const ExpandableMenuItem: React.FC<ExpandableMenuItemProps> = ({
  item,
  navigation,
  level = 0,
  parent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotationValue = useSharedValue(0);
  const heightValue = useSharedValue(0);

  const toggleExpanded = () => {
    if (item.children) {
      setIsExpanded(!isExpanded);
      rotationValue.value = withTiming(isExpanded ? 0 : 1, { duration: 300 });
      const itemHeight = 65;
      const totalHeight = isExpanded ? 0 : item.children.length * itemHeight + 10;
      heightValue.value = withTiming(totalHeight, { duration: 300 });
    } else {
      NavigationService.navigateToDrawerItem(item.id, { fromDrawer: true });
    }
  };

  const rotationStyle = useAnimatedStyle(() => {
    const rotation = interpolate(rotationValue.value, [0, 1], [0, 90]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const heightStyle = useAnimatedStyle(() => {
    return {
      height: heightValue.value,
      opacity: interpolate(heightValue.value, [0, 1], [0, 1]),
    };
  });

  return (
    <View style={[styles.menuItemContainer, { marginLeft: level * 20 }]}>
      <TouchableOpacity
        style={[styles.menuItem, level > 0 && styles.subMenuItem]}
        onPress={toggleExpanded}
        activeOpacity={0.7}>

        <View style={styles.menuItemContent}>
          <Icon name={item.icon} size={24} style={styles.menuIcon} />
          <Text style={[styles.menuText, level > 0 && styles.subMenuText]}>{item.title}</Text>
        </View>

        {item.children && (
          <Animated.View style={rotationStyle}>
            <Icon name="chevron-right" size={20} color={theme.colors.text.primary} />
          </Animated.View>
        )}
      </TouchableOpacity>

      {item.children && (
        <Animated.View style={[styles.subMenuContainer, heightStyle]}>
          <View style={styles.subMenuWrapper}>
            {item.children.map(child => (
              <ExpandableMenuItem
                key={child.id}
                item={child}
                navigation={navigation}
                parent={item}
                level={level + 1}
              />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = props => {
  const { logout, authState } = useAuthContext();
  const insets = useSafeAreaInsets();
  const { authResponse } = useAuthState();
  const role: UserRole = { id: 'student', label: 'Admin', value: UserRoleValue.STUDENT };

  const user = authResponse?.user;

  const userName = user ? user?.email : 'NA';

  // Get navigation items based on user role - much simpler now!
  const navigationItems = authState ? getNavigationItemsByRole(role) : [];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={[styles.drawerContainer, { marginBottom: insets.bottom }]}>
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : theme.spacing.md) },
        ]}>
        <View style={[styles.header]}>
          <View style={{ flex: 1, gap: theme.spacing.md }}>
            <TouchableOpacity
              onPress={() => { }}
              style={{
                flexDirection: 'row',
                gap: theme.spacing.sm,
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/images/user_avatar.webp')}
                style={styles.userAvatarImage}
                resizeMode={'contain'}
              />
              {authState && (
                <View style={styles.userInfo}>
                  <Heading6 color={theme.colors.white} numberOfLines={1}>
                    {userName}
                  </Heading6>
                  <Caption color={theme.colors.white}>{role.label}</Caption>
                </View>
              )}
            </TouchableOpacity>
            <View
              style={{
                justifyContent: 'flex-start',
                flexDirection: 'row',
                gap: theme.spacing.lg,
              }}>
              <IconButton
                size={'small'}
                variant={'outlined'}
                outlineColor={theme.colors.text.onPrimary}
                iconName={'notifications'}
                onPress={() => { }}
              />
              <IconButton
                size={'small'}
                outlineColor={theme.colors.text.onPrimary}
                variant={'outlined'}
                iconName={'message'}
                onPress={() => { }}
              />
            </View>
          </View>
          <Image
            source={require('../assets/images/brand_logo_full.png')}
            style={styles.headerIconContainer}
            resizeMode={'contain'}
          />
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.scrollableContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {navigationItems.map(item => (
            <ExpandableMenuItem key={item.id} item={item} navigation={props.navigation} />
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Fixed Logout Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.menuItemContent}>
            <Icon
              name="logout"
              size={24}
              style={[styles.menuIcon, { color: theme.colors.status.error }]}
            />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  headerContainer: {
    flexDirection: 'column',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
  headerIconContainer: {
    width: 120,
    height: 40,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarImage: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    ...textStyles.h3,
    color: theme.colors.text.onPrimary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.body2,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollableContent: {
    flex: 1, // Takes remaining space between header and bottom
  },
  scrollContentContainer: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  menuContainer: {
    // paddingHorizontal: theme.spacing.sm,
  },
  menuItemContainer: {
    marginBottom: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    // paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.transparent,
    // ...theme.shadows.sm,
  },
  subMenuItem: {
    backgroundColor: theme.colors.transparent,
    marginTop: theme.spacing.xs / 2,
    elevation: 0,
    shadowOpacity: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: theme.spacing.md,
    color: theme.colors.primaryDark,
  },
  menuText: {
    ...textStyles.body1,
    color: theme.colors.primaryDark,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
  },
  subMenuText: {
    ...textStyles.body2,
    color: theme.colors.primaryDark,
  },
  subMenuContainer: {
    overflow: 'hidden',
  },
  subMenuWrapper: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
  bottomSection: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    // Remove marginTop and borderTop since it's now in bottomSection
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
  userInfo: {},
  userName: {
    ...textStyles.body1,
    color: theme.colors.text.onPrimary,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
