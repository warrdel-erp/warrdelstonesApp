import React from 'react';
import { ActivityIndicator } from 'react-native';
import { getTokens, Text, useTheme, XStack, YStack } from 'tamagui';

export interface SpinnerProps {
    /** Size of the spinner */
    size?: 'small' | 'medium' | 'large';
    /** Color of the spinner */
    color?: string;
    /** Show spinner centered in a container */
    centered?: boolean;
    /** Custom message to display below spinner */
    message?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'medium',
    color,
    centered = false,
    message,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const spinnerColor = color || theme.primary?.val || '#0891B2';

    const spinner = (
        <ActivityIndicator
            size={size === 'small' ? 'small' : 'large'}
            color={spinnerColor}
        />
    );

    if (centered) {
        return (
            <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                gap={message ? tokens.space[2].val : 0}
            >
                {spinner}
                {message && (
                    <Text
                        fontSize={tokens.size[3.5].val}
                        color={theme.textSecondary?.val || '#6B7280'}
                    >
                        {message}
                    </Text>
                )}
            </YStack>
        );
    }

    if (message) {
        return (
            <XStack
                alignItems="center"
                gap={tokens.space[2].val}
            >
                {spinner}
                <Text
                    fontSize={tokens.size[3.5].val}
                    color={theme.textSecondary?.val || '#6B7280'}
                >
                    {message}
                </Text>
            </XStack>
        );
    }

    return spinner;
};

export default Spinner;

