import React from 'react';
import { View, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface SpacerProps {
  size?: keyof typeof theme.spacing;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'md', horizontal = false }) => {
  const spacerStyle: ViewStyle = horizontal
    ? { width: theme.spacing[size] }
    : { height: theme.spacing[size] };

  return <View style={spacerStyle} />;
};

export default Spacer;
