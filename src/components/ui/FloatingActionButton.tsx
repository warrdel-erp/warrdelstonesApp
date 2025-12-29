import { Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { getTokens, useTheme, XStack } from 'tamagui';

export interface FloatingActionButtonProps {
    /** Icon to display (defaults to Plus icon) */
    icon?: React.ReactNode;
    /** Callback when button is pressed */
    onPress: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Size of the button */
    size?: 'small' | 'medium' | 'large';
    /** Custom bottom offset (defaults to safe area aware) */
    bottom?: number;
    /** Custom right offset */
    right?: number;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon,
    onPress,
    disabled = false,
    size = 'medium',
    bottom,
    right,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return {
                    width: 48,
                    height: 48,
                    iconSize: 20,
                    borderRadius: 24,
                };
            case 'large':
                return {
                    width: 64,
                    height: 64,
                    iconSize: 28,
                    borderRadius: 32,
                };
            case 'medium':
            default:
                return {
                    width: 56,
                    height: 56,
                    iconSize: 24,
                    borderRadius: 28,
                };
        }
    };

    const sizeConfig = getSizeConfig();
    const defaultBottom = bottom ?? tokens.space[4].val;
    const defaultRight = right ?? tokens.space[4].val;

    const defaultIcon = icon || (
        <Plus
            size={sizeConfig.iconSize}
            color={theme.white?.val || '#FFFFFF'}
        />
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.8}
            style={{
                position: 'absolute',
                bottom: defaultBottom,
                right: defaultRight,
                width: sizeConfig.width,
                height: sizeConfig.height,
                borderRadius: sizeConfig.borderRadius,
                backgroundColor: disabled
                    ? theme.textCaption?.val || '#9CA3AF'
                    : theme.primary?.val || '#0891B2',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                opacity: disabled ? 0.6 : 1,
            }}
        >
            <XStack alignItems="center" justifyContent="center">
                {defaultIcon}
            </XStack>
        </TouchableOpacity>
    );
};

export default FloatingActionButton;

