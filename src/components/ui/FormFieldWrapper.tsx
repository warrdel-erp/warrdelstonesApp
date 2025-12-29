import React, { ReactNode } from 'react';
import { getTokens, Text, useTheme, XStack, YStack, YStackProps } from 'tamagui';

export interface FormFieldWrapperProps extends YStackProps {
    label?: string;
    required?: boolean;
    helperText?: string;
    error?: string;
    children: ReactNode;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
    label,
    required,
    helperText,
    error,
    children,
    ...stackProps
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const hasError = !!error;

    return (
        <YStack
            gap={tokens.space[1].val}
            alignItems="flex-start"
            {...stackProps}
        >
            {label && (
                <XStack alignItems="center" gap={tokens.space[1].val}>
                    <Text
                        fontSize={tokens.size[3].val}
                        fontWeight="500"
                        color={theme.textCaption?.val || '#6B7280'}
                    >
                        {label}
                    </Text>
                    {required && (
                        <Text
                            fontSize={tokens.size[3].val}
                            color={theme.statusError?.val || '#DC2626'}
                        >
                            *
                        </Text>
                    )}
                </XStack>
            )}

            {children}

            {hasError ? (
                <Text
                    fontSize={tokens.size[3].val}
                    color={theme.statusError?.val || '#DC2626'}
                >
                    {error}
                </Text>
            ) : helperText ? (
                <Text
                    fontSize={tokens.size[3].val}
                    color={theme.textCaption?.val || '#9CA3AF'}
                >
                    {helperText}
                </Text>
            ) : null}
        </YStack>
    );
};

export default FormFieldWrapper;


