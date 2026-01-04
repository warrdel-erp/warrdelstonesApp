import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { getTokens, useTheme } from 'tamagui';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  /** Make button full width */
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  loading = false,
  disabled = false,
  icon,
  children,
  fullWidth = false,
  ...props
}) => {
  const tokens = getTokens();
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const commonStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: tokens.radius[4].val,
      minHeight: 44, // Minimum touch target size for accessibility
    };

    if (fullWidth) {
      commonStyle.width = '100%';
    }

    // Size styles
    let sizeStyle: ViewStyle = {};
    switch (size) {
      case 'extraSmall':
        sizeStyle = {
          paddingVertical: tokens.space[1].val,
          paddingHorizontal: tokens.space[3].val,
          minHeight: 28,
        };
        break;
      case 'small':
        sizeStyle = {
          paddingVertical: tokens.space[2].val,
          paddingHorizontal: tokens.space[4].val,
          minHeight: 36,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: tokens.space[4].val,
          paddingHorizontal: tokens.space[6].val,
          minHeight: 52,
        };
        break;
      default: // medium
        sizeStyle = {
          paddingVertical: tokens.space[3].val,
          paddingHorizontal: tokens.space[5].val,
          minHeight: 44,
        };
    }

    // Variant styles
    let variantStyle: ViewStyle = {};
    if (disabled) {
      variantStyle = {
        backgroundColor: theme.gray3?.val || '#D1D5DB',
        borderWidth: 0,
        opacity: 0.6,
      };
    } else {
      switch (variant) {
        case 'primary':
          variantStyle = {
            backgroundColor: theme.blue9?.val || '#3B82F6',
            borderWidth: 0,
            shadowColor: theme.blue9?.val || '#3B82F6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          };
          break;
        case 'secondary':
          variantStyle = {
            backgroundColor: theme.green9?.val || '#10B981',
            borderWidth: 0,
            shadowColor: theme.green9?.val || '#10B981',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          };
          break;
        case 'outline':
          variantStyle = {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.blue8?.val || '#3B82F6',
          };
          break;
        case 'text':
          variantStyle = {
            backgroundColor: 'transparent',
            borderWidth: 0,
          };
          break;
      }
    }

    return { ...commonStyle, ...sizeStyle, ...variantStyle };
  };

  const getTextStyle = (): TextStyle => {
    let colorStyle: TextStyle = {};
    let fontWeight: TextStyle = {};

    if (disabled) {
      colorStyle = { color: theme.gray9?.val || '#6B7280' };
      fontWeight = { fontWeight: '500' };
    } else {
      switch (variant) {
        case 'primary':
        case 'secondary':
          colorStyle = { color: theme.white?.val || '#FFFFFF' };
          fontWeight = { fontWeight: '600' };
          break;
        case 'outline':
          colorStyle = { color: theme.blue9?.val || '#3B82F6' };
          fontWeight = { fontWeight: '600' };
          break;
        case 'text':
          colorStyle = { color: theme.blue9?.val || '#3B82F6' };
          fontWeight = { fontWeight: '500' };
          break;
      }
    }

    let sizeStyle: TextStyle = {};
    switch (size) {
      case 'extraSmall':
        sizeStyle = { fontSize: tokens.size[3].val };
        break;
      case 'small':
        sizeStyle = { fontSize: tokens.size[3.5].val };
        break;
      case 'large':
        sizeStyle = { fontSize: tokens.size[4.5].val };
        break;
      default: // medium
        sizeStyle = { fontSize: tokens.size[4].val };
    }

    return {
      ...colorStyle,
      ...fontWeight,
      ...sizeStyle,
      letterSpacing: 0.3,
    };
  };

  const getLoadingColor = (): string => {
    if (disabled) {
      return theme.gray9?.val || '#6B7280';
    }
    switch (variant) {
      case 'primary':
      case 'secondary':
        return theme.white?.val || '#FFFFFF';
      case 'outline':
        return theme.blue9?.val || '#3B82F6';
      case 'text':
        return theme.blue9?.val || '#3B82F6';
      default:
        return theme.white?.val || '#FFFFFF';
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      activeOpacity={0.7}
      disabled={isDisabled}
      {...props}
      onPress={e => {
        if (!isDisabled) {
          props?.onPress?.(e);
        }
      }}>
      {loading ? (
        <ActivityIndicator size="small" color={getLoadingColor()} />
      ) : (
        <>
          {icon && <View style={{ marginRight: title ? tokens.space[2].val : 0 }}>{icon}</View>}
          {children || <Text style={getTextStyle()}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
