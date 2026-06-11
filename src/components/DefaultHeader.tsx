import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, textStyles } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import NavigationService from '../navigation/NavigationService';
import { ScreenId } from '../navigation/navigationConstants';
import { AppContextSelector } from './AppContextSelector';
import { useAppState } from '../store/hooks';
import { Caption } from './ui';

export interface CustomHeaderProps {
  title?: string;
  subtitle?: string;
  navigation: any;
  rightComponent?: React.ReactNode;
  customComponent?: React.ReactNode;
  showMenuButton?: boolean;
  onBackPress?: () => boolean; // Return true to prevent default back behavior
}

const DefaultHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  navigation,
  rightComponent,
  customComponent,
  showMenuButton = false,
  onBackPress,
}) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { selectedLocation } = useAppState();
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Simplified logic: Show back button everywhere except Home screen
  const showMenuIcon = showMenuButton || route.name === ScreenId.HOME;

  const handleMenuPress = () => {
    navigation.openDrawer();
  };

  const handleBackPress = () => {
    // Check if screen wants to handle back press
    if (onBackPress && onBackPress()) {
      return; // Screen handled the back press
    }

    // Use NavigationService for proper back navigation
    NavigationService.goBack();
  };

  // If custom component is provided, render it instead
  if (customComponent) {
    return <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0) }]}>{customComponent}</View>;
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 16 : 0) }]}>
      <View style={styles.leftSection}>
        {!showMenuIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.parentMenuText}>{title}</Text>}
        {subtitle && <Text style={styles.titleText}>{subtitle}</Text>}
      </View>

      <View style={[styles.rightSection, !rightComponent && { width: 'auto' }]}>
        {rightComponent || (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              maxWidth: 100,
              width: 100,
              borderColor: theme.colors.white,
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.md,
            }}
            onPress={() => setShowLocationModal(true)}>
            <Caption
              style={{ flex: 1 }}
              color={theme.colors.text.onPrimary}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {selectedLocation?.locationName || 'Location'}
            </Caption>
            <Icon name={'keyboard-arrow-down'} color={theme.colors.white} size={20} />
          </TouchableOpacity>
        )}
      </View>

      <AppContextSelector visible={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primaryDark,
    paddingTop: Platform.OS === 'ios' ? 0 : theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.md,
  },
  leftSection: {
    width: 36,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
  },
  rightSection: {
    width: 36,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  parentMenuText: {
    ...textStyles.h6,
    color: theme.colors.white,
  },
  titleText: {
    ...textStyles.body2,
    color: theme.colors.white,
    textAlign: 'center',
  },
});

export default DefaultHeader;
