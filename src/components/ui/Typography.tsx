import React from 'react';
import { Text, TextProps } from 'react-native';
import { textStyles } from '../../theme';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  color?: string;
}

export const Heading1: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h1, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading2: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h2, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading3: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h3, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading4: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h4, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading5: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h5, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Heading6: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.h6, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const BodyText: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.body1, color && { color }, style]} {...props}>
    {children}
  </Text>
);

export const Caption: React.FC<TypographyProps> = ({ children, style, color, ...props }) => (
  <Text style={[textStyles.caption, color && { color }, style]} {...props}>
    {children}
  </Text>
);
