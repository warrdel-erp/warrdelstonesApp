import React from 'react';
import theme from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Heading6 } from './Typography.tsx';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';

interface CheckBoxProps {
  title: string;
  checked: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange: (checked: Boolean) => void;
  style?: ViewStyle;
}

export const CheckBox: React.FC<CheckBoxProps> = props => {
  const toggleChecked = () => {
    props.onChange(!props.checked);
  };

  const iconSize = props.size === 'small' ? 16 : props.size === 'large' ? 38 : 20;
  const iconColor = props.disabled ? theme.colors.text.disabled : theme.colors.primaryDark;
  const titleColor = props.disabled ? theme.colors.text.disabled : theme.colors.primaryDark;
  const titleStyle = { flex: 1, flexShrink: 1, color: titleColor, fontSize: iconSize - 4 };

  return (
    <TouchableOpacity
      disabled={props.disabled}
      onPress={toggleChecked}
      style={{
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'flex-start',
        ...props.style,
      }}>
      {!props.checked && (
        <Icon size={iconSize} name={'check-box-outline-blank'} color={iconColor} />
      )}
      {props.checked && <Icon size={iconSize} name={'check-box'} color={iconColor} />}
      <Heading6 style={titleStyle}>{props.title}</Heading6>
    </TouchableOpacity>
  );
};
