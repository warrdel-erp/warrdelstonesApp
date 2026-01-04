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
    // Check if error is only a required error (contains "required" and is simple)
    const isRequiredOnlyError = hasError && required && (
        error.toLowerCase().includes('required') ||
        error.toLowerCase().includes('is required')
    );

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

            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, {
                    error: hasError,
                    hasError: hasError,
                })
                : children}

            {/* Only show error text if it's NOT a required-only error */}
            {hasError && !isRequiredOnlyError ? (
                <Text
                    fontSize={tokens.size[3].val}
                    color={theme.statusError?.val}
                >
                    {error}
                </Text>
            ) : helperText && !hasError ? (
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


