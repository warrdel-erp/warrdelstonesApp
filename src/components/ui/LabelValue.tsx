import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { theme } from '../../theme';
import { BodyText } from './Typography';

interface LabelValueProps {
  label: string;
  value: string | number | React.ReactNode;
  mode?: 'horizontal' | 'vertical';
  alignment?: 'left' | 'center' | 'right' | 'space-between';
  fullWidth?: boolean;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  labelComponent?: React.ComponentType<any>;
  valueComponent?: React.ComponentType<any>;
  spacing?: number;
  flex?: {
    label?: number;
    value?: number;
  };
}

/**
 * 
 * @deprecated
 */
export const LabelValue: React.FC<LabelValueProps> = ({
  label,
  value,
  mode = 'horizontal',
  alignment = 'left',
  fullWidth = true,
  containerStyle,
  labelStyle,
  valueStyle,
  labelComponent: LabelComponent = BodyText,
  valueComponent: ValueComponent = BodyText,
  spacing = theme.spacing.xs,
  flex,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...(fullWidth && { width: '100%' }),
    };

    if (mode === 'horizontal') {
      baseStyle.flexDirection = 'row';

      switch (alignment) {
        case 'left':
          baseStyle.justifyContent = 'flex-start';
          baseStyle.alignItems = 'flex-start';
          break;
        case 'center':
          baseStyle.justifyContent = 'center';
          baseStyle.alignItems = 'center';
          break;
        case 'right':
          baseStyle.justifyContent = 'flex-end';
          baseStyle.alignItems = 'flex-end';
          break;
        case 'space-between':
          baseStyle.justifyContent = 'space-between';
          baseStyle.alignItems = 'center';
          break;
      }

      baseStyle.gap = spacing;
    } else {
      // Vertical mode
      baseStyle.flexDirection = 'column';

      switch (alignment) {
        case 'left':
          baseStyle.alignItems = 'flex-start';
          break;
        case 'center':
          baseStyle.alignItems = 'center';
          break;
        case 'right':
          baseStyle.alignItems = 'flex-end';
          break;
        case 'space-between':
          baseStyle.justifyContent = 'space-between';
          break;
      }

      baseStyle.gap = spacing;
    }

    return baseStyle;
  };

  const getLabelContainerStyle = (): ViewStyle => {
    const style: ViewStyle = {};

    if (mode === 'horizontal' && flex?.label) {
      style.flex = flex.label;
    }

    return style;
  };

  const getValueContainerStyle = (): ViewStyle => {
    const style: ViewStyle = {};

    if (mode === 'horizontal' && flex?.value) {
      style.flex = flex.value;
    }

    return style;
  };

  const getDefaultLabelStyle = (): TextStyle => ({
    color: theme.colors.text.onSurface,
    ...labelStyle,
  });

  const getDefaultValueStyle = (): TextStyle => ({
    color: theme.colors.primaryDark,
    ...valueStyle,
  });

  const renderValue = () => {
    if (typeof value === 'string' || typeof value === 'number') {
      return <ValueComponent style={getDefaultValueStyle()}>{value}</ValueComponent>;
    }
    return value;
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      <View style={getLabelContainerStyle()}>
        <LabelComponent style={getDefaultLabelStyle()}>{label}</LabelComponent>
      </View>
      <View style={getValueContainerStyle()}>{renderValue()}</View>
    </View>
  );
};
