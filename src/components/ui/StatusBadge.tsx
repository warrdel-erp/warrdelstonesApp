import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../theme';
import { Caption } from './Typography.tsx';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  text: string;
  size?: 'extraSmall' | 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'medium' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return theme.colors.status.success;
      case 'warning':
        return theme.colors.status.warning;
      case 'error':
        return theme.colors.status.error;
      case 'info':
        return theme.colors.status.info;
      default:
        return theme.colors.primary;
    }
  };

  const badgeStyle: ViewStyle = {
    backgroundColor: getStatusColor(),
    paddingHorizontal: size === 'extraSmall' ? theme.spacing.sm :  size === 'small' ? theme.spacing.sm : theme.spacing.md,
    paddingVertical: size === 'extraSmall' ? 4 : size === 'small' ? theme.spacing.xs / 2 : theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  };

  const textStyle: TextStyle = {
    color: theme.colors.text.onPrimary,
    fontSize: size === 'extraSmall' ? 10 : size === 'small' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  };

  return (
    <View style={badgeStyle}>
      <Caption style={textStyle}>{text}</Caption>
    </View>
  );
};

export default StatusBadge;
