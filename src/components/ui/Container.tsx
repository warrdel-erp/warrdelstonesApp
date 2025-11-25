import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface ContainerProps extends ViewProps {
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  padding = 'sm',
  margin,
  children,
  style,
  ...props
}) => {
  const containerStyle: ViewStyle = {
    padding: theme.spacing[padding],
    ...(margin && { margin: theme.spacing[margin] }),
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default Container;
