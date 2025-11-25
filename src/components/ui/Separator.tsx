import React from 'react';
import { View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface SeparatorProps {
  margin?: keyof typeof theme.spacing;
}

export const Separator: React.FC<SeparatorProps> = ({ margin = 'md' }) => {
  const separatorStyle: ViewStyle = {
    height: 1,
    backgroundColor: theme.colors.border.medium,
  };

  return <View style={separatorStyle} />;
};

export default Separator;
