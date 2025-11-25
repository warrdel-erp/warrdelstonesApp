import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, textStyles } from '../theme';
import { useRoute } from '@react-navigation/native';
import NavigationService from '../navigation/NavigationService';
import { ScreenId } from '../navigation/navigationConstants';

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
    return <View style={styles.container}>{customComponent}</View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {!showMenuIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
            <Icon name="menu" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.parentMenuText}>{title}</Text>}
        {subtitle && <Text style={styles.titleText}>{subtitle}</Text>}
      </View>

      <View style={styles.rightSection}>
        {rightComponent || <View style={styles.iconButton} />}
      </View>
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
