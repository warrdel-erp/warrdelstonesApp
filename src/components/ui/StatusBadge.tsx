import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { Icon } from './Icon';
import { Caption } from './Typography.tsx';

export type StatusBadgeStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'pink';

export type StatusBadgeVariant = 'solid' | 'soft' | 'outlined';
export type StatusBadgeSize = 'extraSmall' | 'small' | 'medium' | 'large';

interface StatusBadgeProps {
  /**
   * Status type that determines the color scheme
   */
  status?: StatusBadgeStatus;

  /**
   * Text to display in the badge
   */
  text: string;

  /**
   * Size of the badge
   * @default 'medium'
   */
  size?: StatusBadgeSize;

  /**
   * Variant style: solid (filled), soft (light background), or outlined
   * @default 'solid'
   */
  variant?: StatusBadgeVariant;

  /**
   * Custom background color (overrides status color)
   */
  backgroundColor?: string;

  /**
   * Custom text color (overrides status color)
   */
  textColor?: string;

  /**
   * Icon name to display before the text (Lucide icon)
   */
  icon?: string;

  /**
   * Icon family (if not using default Lucide)
   */
  iconFamily?: 'Lucide' | 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'Feather';

  /**
   * Custom style for the badge container
   */
  style?: ViewStyle;

  /**
   * Custom style for the text
   */
  textStyle?: TextStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'info',
  text,
  size = 'medium',
  variant = 'solid',
  backgroundColor,
  textColor,
  icon,
  iconFamily = 'Lucide',
  style,
  textStyle,
}) => {
  const getStatusColors = () => {
    const colorMap: Record<StatusBadgeStatus, { solid: string; soft: string; text: string }> = {
      success: {
        solid: theme.colors.status.success,
        soft: `${theme.colors.status.success}33`, // 20% opacity
        text: theme.colors.status.success,
      },
      warning: {
        solid: theme.colors.status.warning,
        soft: `${theme.colors.status.warning}33`,
        text: theme.colors.status.warning,
      },
      error: {
        solid: theme.colors.status.error,
        soft: `${theme.colors.status.error}33`,
        text: theme.colors.status.error,
      },
      info: {
        solid: theme.colors.status.info,
        soft: `${theme.colors.status.info}33`,
        text: theme.colors.status.info,
      },
      primary: {
        solid: theme.colors.primary,
        soft: `${theme.colors.primary}33`,
        text: theme.colors.primary,
      },
      secondary: {
        solid: theme.colors.secondary,
        soft: `${theme.colors.secondary}33`,
        text: theme.colors.secondary,
      },
      neutral: {
        solid: theme.colors.text.secondary,
        soft: `${theme.colors.text.secondary}33`,
        text: theme.colors.text.secondary,
      },
      purple: {
        solid: '#9333EA',
        soft: '#9333EA33',
        text: '#9333EA',
      },
      orange: {
        solid: '#F97316',
        soft: '#F9731633',
        text: '#F97316',
      },
      teal: {
        solid: '#14B8A6',
        soft: '#14B8A633',
        text: '#14B8A6',
      },
      pink: {
        solid: '#EC4899',
        soft: '#EC489933',
        text: '#EC4899',
      },
    };

    return colorMap[status];
  };

  const colors = getStatusColors();

  const getSizeConfig = () => {
    switch (size) {
      case 'extraSmall':
        return {
          paddingHorizontal: theme.spacing.xs,
          paddingVertical: 2,
          fontSize: 9,
          iconSize: 10,
          gap: 4,
        };
      case 'small':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs / 2,
          fontSize: theme.typography.fontSize.xs,
          iconSize: 12,
          gap: 4,
        };
      case 'large':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          fontSize: theme.typography.fontSize.base,
          iconSize: 16,
          gap: 6,
        };
      case 'medium':
      default:
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
          fontSize: theme.typography.fontSize.sm,
          iconSize: 14,
          gap: 5,
        };
    }
  };

  const sizeConfig = getSizeConfig();

  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingHorizontal: sizeConfig.paddingHorizontal,
      paddingVertical: sizeConfig.paddingVertical,
      borderRadius: theme.borderRadius.full,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: sizeConfig.gap,
    };

    if (backgroundColor) {
      return {
        ...baseStyle,
        backgroundColor,
        ...(variant === 'outlined' && {
          borderWidth: 1,
          borderColor: backgroundColor,
          backgroundColor: 'transparent',
        }),
      };
    }

    switch (variant) {
      case 'soft':
        return {
          ...baseStyle,
          backgroundColor: colors.soft,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.solid,
        };
      case 'solid':
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.solid,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: sizeConfig.fontSize,
      fontWeight: theme.typography.fontWeight.medium,
    };

    if (textColor) {
      return {
        ...baseStyle,
        color: textColor,
      };
    }

    switch (variant) {
      case 'soft':
      case 'outlined':
        return {
          ...baseStyle,
          color: colors.text,
        };
      case 'solid':
      default:
        return {
          ...baseStyle,
          color: theme.colors.white,
        };
    }
  };

  const badgeStyle = [getBadgeStyle(), style];
  const finalTextStyle = [getTextStyle(), textStyle];

  return (
    <View style={badgeStyle}>
      {icon && (
        <Icon
          name={icon}
          family={iconFamily}
          size={sizeConfig.iconSize}
          color={(finalTextStyle[0]?.color as string) || theme.colors.white}
        />
      )}
      <Caption style={finalTextStyle}>{text}</Caption>
    </View>
  );
};

export default StatusBadge;
