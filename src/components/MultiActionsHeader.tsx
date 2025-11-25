import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, textStyles } from '../theme';
import { useRoute } from '@react-navigation/native';
import NavigationService from '../navigation/NavigationService';
import { ScreenId } from '../navigation/navigationConstants';
import { IconButton, IconButtonProps } from './ui/IconButton.tsx';
import { useScreenContext } from '../context/ScreenContext.tsx';

export interface CustomHeaderProps {
  title?: string;
  subtitle?: string;
  navigation: any;
  icons: HeaderItem[];
  onBackPress?: () => boolean; // Return true to prevent default back behavior
}
export interface HeaderItem {
  iconProps: Partial<IconButtonProps>;
  action: string;
}

const MultiActionsHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  navigation,
  icons,
  onBackPress,
}) => {
  const route = useRoute();
  const { actions } = useScreenContext();

  // Simplified logic: Show back button everywhere except Home screen
  const shouldShowBackButton = route.name !== ScreenId.HOME;

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

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {shouldShowBackButton ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
            <Icon name="menu" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {subtitle && <Text style={styles.parentMenuText}>{subtitle}</Text>}
        {title && <Text style={styles.titleText}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {icons.map((item, _) => (
          <IconButton
            {...item.iconProps}
            iconName={item.iconProps.iconName ?? ''}
            onPress={() => {
              if (Object.hasOwn(actions, item.action)) {
                actions[item.action]?.();
              }
            }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
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
    // width: 36,
    flexDirection: 'row',
    gap: theme.spacing.sm,
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
    color: theme.colors.text.onPrimary,
  },
  titleText: {
    ...textStyles.body2,
    color: theme.colors.text.onSurface,
  },
});

export default MultiActionsHeader;
