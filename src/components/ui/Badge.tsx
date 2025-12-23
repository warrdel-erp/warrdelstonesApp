import React from 'react';
import { TouchableOpacity } from 'react-native';
import { getTokens, Text, useTheme, XStack } from 'tamagui';

export interface BadgeProps {
    /**
     * Badge label text
     */
    label: string;

    /**
     * Background color of the badge
     */
    backgroundColor?: string;

    /**
     * Text color of the badge
     */
    textColor?: string;

    /**
     * Size of the badge
     * @default 'small'
     */
    size?: 'extraSmall' | 'small' | 'medium';

    /**
     * Optional icon to display before the label
     */
    icon?: React.ReactNode;

    /**
     * Optional click handler
     */
    onPress?: () => void;

    /**
     * Disabled state
     * @default false
     */
    disabled?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    backgroundColor,
    textColor,
    size = 'small',
    icon,
    onPress,
    disabled = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const getSizeConfig = () => {
        switch (size) {
            case 'extraSmall':
                return {
                    paddingHorizontal: tokens.space[1].val,
                    paddingVertical: 2,
                    fontSize: tokens.size[2.5].val,
                    gap: tokens.space[0.5].val,
                };
            case 'medium':
                return {
                    paddingHorizontal: tokens.space[3].val,
                    paddingVertical: tokens.space[1].val,
                    fontSize: tokens.size[3.5].val,
                    gap: tokens.space[1].val,
                };
            case 'small':
            default:
                return {
                    paddingHorizontal: tokens.space[2].val,
                    paddingVertical: 4,
                    fontSize: tokens.size[3].val,
                    gap: tokens.space[0.5].val,
                };
        }
    };

    const sizeConfig = getSizeConfig();

    const badgeContent = (
        <XStack
            alignItems="center"
            gap={sizeConfig.gap}
            paddingHorizontal={sizeConfig.paddingHorizontal}
            paddingVertical={sizeConfig.paddingVertical}
            borderRadius={tokens.radius.round.val}
            backgroundColor={backgroundColor || theme.primary?.val || '#0891B2'}
            alignSelf="flex-start"
            opacity={disabled ? 0.5 : 1}>
            {icon && <XStack>{icon}</XStack>}
            <Text
                fontSize={sizeConfig.fontSize}
                fontWeight="bold"
                color={textColor || theme.white?.val || '#FFFFFF'}>
                {label}
            </Text>
        </XStack>
    );

    if (onPress && !disabled) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={disabled}>
                {badgeContent}
            </TouchableOpacity>
        );
    }

    return badgeContent;
};

export default Badge;

