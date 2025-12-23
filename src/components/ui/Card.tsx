import React from 'react';
import { TouchableOpacity, View, ViewProps } from 'react-native';
import { componentStyles } from '../../theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * @deprecated
 */
export const Card: React.FC<CardProps> = ({
  elevated = false,
  children,
  style,
  onClick,
  disabled = false,
  ...props
}) => {
  const cardStyle = [elevated ? componentStyles.cardElevated : componentStyles.card, style];

  if (onClick) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onClick}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

export default Card;
