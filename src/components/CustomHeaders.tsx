import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, textStyles } from '../theme';
import { useScreenContext } from '../context/ScreenContext';

// Dashboard Custom Header with interactive elements
export const DashboardHeader: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, actions } = useScreenContext();

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleSearchPress = () => {
    actions.onSearch?.('');
  };

  const handleNotificationPress = () => {
    actions.onNotificationPress?.();
  };

  return (
    <View style={styles.dashboardContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
          <Icon name="menu" size={24} color={theme.colors.text.onPrimary} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.dashboardTitle}>StoneApp Dashboard</Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleSearchPress}>
            <Icon name="search" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleNotificationPress}>
            <Icon name="notifications" size={24} color={theme.colors.text.onPrimary} />
            {state.notifications && state.notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>
                  {state.notifications > 9 ? '9+' : String(state.notifications)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Student List Custom Header with interactive search and filters
export const StudentListHeader: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, actions } = useScreenContext();
  const [searchFocused, setSearchFocused] = useState(false);

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleFilterPress = () => {
    actions.onFilter?.(state.filterOptions || {});
  };

  const handleAddPress = () => {
    actions.onAdd?.();
  };

  const handleSearchChange = (text: string) => {
    actions.onSearch?.(text);
  };

  return (
    <View style={styles.studentListContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
          <Icon name="menu" size={24} color={theme.colors.text.onPrimary} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text style={styles.parentMenuText}>STUDENTS</Text>
          <Text style={styles.titleText}>
            Student Management ({state.selectedItems?.length || 0} selected)
          </Text>
        </View>

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={handleFilterPress}>
            <Icon name="filter-list" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={handleAddPress}>
            <Icon name="person-add" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
          <Icon name="search" size={20} color={theme.colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={state.searchQuery || ''}
            onChangeText={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {state.searchQuery && (
            <TouchableOpacity onPress={() => handleSearchChange('')}>
              <Icon name="close" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Settings Custom Header with profile interaction
export const SettingsHeader: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { state, actions } = useScreenContext();

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleProfilePress = () => {
    actions.onProfilePress?.();
  };

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.topRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
          <Icon name="menu" size={24} color={theme.colors.text.onPrimary} />
        </TouchableOpacity>

        <View style={styles.centerContent}>
          <Text style={styles.titleText}>Settings</Text>
          {state.userData?.name && <Text style={styles.userNameText}>{state.userData.name}</Text>}
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={handleProfilePress}>
          <View style={styles.profileAvatar}>
            {state.userData?.avatar ? (
              <Text style={styles.avatarText}>{state.userData.name?.charAt(0).toUpperCase()}</Text>
            ) : (
              <Icon name="person" size={20} color={theme.colors.primary} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Common styles
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  parentMenuText: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  titleText: {
    ...textStyles.h6,
    color: theme.colors.text.onPrimary,
    fontWeight: theme.typography.fontWeight.semiBold,
    textAlign: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  centerContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Dashboard Header
  dashboardContainer: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg + (Platform.OS === 'android' ? 16 : 32), // Account for status bar on Android
    paddingBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  welcomeText: {
    ...textStyles.h5,
    color: theme.colors.text.onPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dashboardTitle: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },

  // Student List Header
  studentListContainer: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg + 16,
    paddingBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  searchRow: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchPlaceholder: {
    ...textStyles.body2,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: theme.spacing.sm,
  },

  // Settings Header
  settingsContainer: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg + 16,
    paddingBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  profileButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.status.error,
    borderRadius: 10,
    minWidth: 15,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: theme.colors.text.onPrimary,
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.bold,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.typography.fontSize.sm,
  },
  searchContainerFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  userNameText: {
    ...textStyles.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  avatarText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default {
  DashboardHeader,
  StudentListHeader,
  SettingsHeader,
};
