import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { theme, textStyles, componentStyles } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
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
  ...props
}) => {
  const getButtonStyle = (): ViewStyle => {
    let baseStyle = componentStyles.button[variant];
    if (disabled) {
      baseStyle = componentStyles.button.disabled;
    }
    const commonStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
    };

    let sizeStyle: ViewStyle;
    switch (size) {
      case 'extraSmall':
        sizeStyle = {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.sm,
        };
        break;
      case 'small':
        sizeStyle = {
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
        };
        break;
      default:
        sizeStyle = {
          paddingVertical: 12,
          paddingHorizontal: theme.spacing.lg,
        };
    }

    return { ...commonStyle, ...baseStyle, ...sizeStyle };
  };

  const getTextStyle = (): TextStyle => {
    let baseTextStyle = textStyles.button;
    if (disabled) {
      baseTextStyle = {
        ...textStyles.button,
        color: theme.colors.text.disabled,
        fontFamily: theme.typography.fontFamily.medium,
      };
    }

    let colorStyle: TextStyle;
    switch (variant) {
      case 'text':
        colorStyle = { color: theme.colors.primary };
        break;
      case 'outline':
        colorStyle = { color: theme.colors.primary };
        break;
      case 'secondary':
        colorStyle = { color: theme.colors.text.onPrimary };
        break;
      default:
        colorStyle = { color: theme.colors.text.onPrimary };
    }

    let sizeStyle: TextStyle;
    switch (size) {
      case 'extraSmall':
        sizeStyle = { fontSize: theme.typography.fontSize.xs };
        break;
      case 'small':
        sizeStyle = { fontSize: theme.typography.fontSize.sm };
        break;
      case 'large':
        sizeStyle = { fontSize: theme.typography.fontSize.lg };
        break;
      default:
        sizeStyle = { fontSize: theme.typography.fontSize.base };
    }

    return { ...baseTextStyle, ...colorStyle, ...sizeStyle };
  };

  const loadingBarColor = (): string => {
    let color: string;
    switch (variant) {
      case 'text':
        color = theme.colors.text.primary;
        break;
      case 'outline':
        color = theme.colors.primaryDark;
        break;
      case 'secondary':
        color = theme.colors.text.onPrimary;
        break;
      default:
        color = theme.colors.text.onPrimary;
    }
    return color;
  };

  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          gap: size === 'extraSmall' ? theme.spacing.xs : theme.spacing.sm,
          opacity: loading ? 0.6 : 1,
          ...(size === 'extraSmall' && { borderRadius: 50 }),
        },
        getButtonStyle(),
        style,
      ]}
      activeOpacity={0.8}
      {...props}
      onPress={e => {
        if (!disabled && !loading) {
          props?.onPress?.(e);
        }
      }}>
      {icon && <View>{icon}</View>}
      {children || <Text style={getTextStyle()}>{title}</Text>}
      {loading && <ActivityIndicator size={'small'} color={loadingBarColor()} />}
    </TouchableOpacity>
  );
};

export default Button;
