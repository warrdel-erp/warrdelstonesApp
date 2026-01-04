import { Check } from '@tamagui/lucide-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, XStack, YStack, getTokens, useTheme } from 'tamagui';

interface CheckBoxProps {
  title?: string;
  checked: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange: (checked: boolean) => void;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  title,
  checked,
  disabled = false,
  size = 'medium',
  onChange,
}) => {
  const tokens = getTokens();
  const theme = useTheme();

  const boxSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const iconSize = size === 'small' ? 12 : size === 'large' ? 18 : 14;

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <XStack gap={tokens.space[2].val} alignItems="center">
        <YStack
          width={boxSize}
          height={boxSize}
          borderRadius={tokens.radius[1].val}
          borderWidth={2}
          borderColor={
            disabled
              ? theme.borderLight?.val
              : checked
                ? theme.primary?.val
                : theme.borderMedium?.val
          }
          backgroundColor={
            disabled
              ? theme.backgroundHover?.val
              : checked
                ? theme.primary?.val
                : 'transparent'
          }
          alignItems="center"
          justifyContent="center"
          opacity={disabled ? 0.5 : 1}
        >
          {checked && (
            <Check
              size={iconSize}
              color={theme.background?.val}
              strokeWidth={3}
            />
          )}
        </YStack>
        {title && (
          <Text
            fontSize={tokens.size[3.5].val}
            color={
              disabled
                ? theme.textCaption?.val
                : theme.textPrimary?.val
            }
          >
            {title}
          </Text>
        )}
      </XStack>
    </TouchableOpacity>
  );
};
