import React from 'react';
import { SvgProps } from 'react-native-svg';
import theme from '../../theme';

interface SvgIconProps extends SvgProps {
  SvgComponent: React.FC<SvgProps>;
  size?: number;
  color?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ SvgComponent, size = 24, color = theme.colors.transparent, ...props }) => {
  return <SvgComponent width={size} height={size} fill={color} {...props} />;
};

export default SvgIcon;
