import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';

export type IconButtonVariant = 'primary' | 'secondary' | 'outlined' | 'plain';
export type IconButtonSize = 'extraSmall' | 'small' | 'medium' | 'large';

export interface IconButtonProps {
  // Icon properties
  iconName: string;
  iconColor?: string;

  // Button properties
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  outlineColor?: string;

  // Interaction
  onPress: () => void;
  disabled?: boolean;

  // Styling
  style?: ViewStyle;

  // Accessibility
  testID?: string;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconColor,
  variant = 'primary',
  size = 'medium',
  outlineColor,
  onPress,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}) => {
  // Get size configurations
  const getSizeConfig = () => {
    switch (size) {
      case 'extraSmall':
        return {
          buttonSize: 24,
          iconSize: 14,
          borderRadius: 12,
        };
      case 'small':
        return {
          buttonSize: 32,
          iconSize: 16,
          borderRadius: 16,
        };
      case 'large':
        return {
          buttonSize: 44,
          iconSize: 28,
          borderRadius: 28,
        };
      case 'medium':
      default:
        return {
          buttonSize: 36,
          iconSize: 24,
          borderRadius: 22,
        };
    }
  };

  // Get variant styles
  const getVariantStyles = (): ViewStyle => {
    const { buttonSize, borderRadius } = getSizeConfig();

    const baseStyle: ViewStyle = {
      width: buttonSize,
      height: buttonSize,
      borderRadius: borderRadius,
      justifyContent: 'center',
      alignItems: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.black,
          ...theme.shadows.sm,
        };

      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.black,
          ...theme.shadows.sm,
        };

      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: outlineColor || theme.colors.white,
        };

      case 'plain':
      default:
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
    }
  };

  // Get icon color based on variant
  const getIconColor = (): string => {
    if (iconColor) return iconColor;

    if (disabled) {
      return theme.colors.text.disabled;
    }

    switch (variant) {
      case 'primary':
        return theme.colors.primaryDark;
      case 'secondary':
        return theme.colors.primaryDark;
      case 'outlined':
        return outlineColor || theme.colors.primaryDark;
      case 'plain':
      default:
        return theme.colors.primaryDark;
    }
  };

  // Get disabled styles
  const getDisabledStyles = (): ViewStyle => {
    if (!disabled) return {};

    return {
      opacity: 0.5,
      backgroundColor:
        variant === 'outlined' || variant === 'plain' ? 'transparent' : theme.colors.surfaceVariant,
    };
  };

  const { iconSize } = getSizeConfig();
  const buttonStyles = [styles.button, getVariantStyles(), disabled && getDisabledStyles(), style];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      testID={testID}
      accessibilityLabel={accessibilityLabel || `${iconName} button`}
      accessibilityRole="button"
      accessibilityState={{ disabled }}>
      <Icon name={iconName} size={iconSize} color={getIconColor()} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Base button styles - variants will override these
  },
});

export default IconButton;
