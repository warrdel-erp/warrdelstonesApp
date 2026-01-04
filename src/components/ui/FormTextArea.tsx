import React from 'react';
import {
    Input,
    getTokens,
    useTheme,
} from 'tamagui';

export interface FormTextAreaProps {
    value?: string | null;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    numberOfLines?: number;
    disabled?: boolean;
    error?: boolean;
    hasError?: boolean;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
    value,
    onChange,
    placeholder,
    numberOfLines = 4,
    disabled = false,
    error = false,
    hasError = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const showError = error || hasError;

    return (
        <Input
            multiline
            numberOfLines={numberOfLines}
            value={value ?? ''}
            placeholder={placeholder || 'Type here'}
            paddingHorizontal={tokens.space[3].val}
            paddingVertical={tokens.space[2].val}
            fontSize={tokens.size[3.5].val}
            backgroundColor={theme.background?.val}
            textAlignVertical="top"
            editable={!disabled}
            width={'100%'}
            opacity={disabled ? 0.6 : 1}
            onChangeText={(text) => onChange(text || undefined)}
            borderColor={showError ? theme.statusError?.val || '#DC2626' : theme.borderMedium?.val || '#D1D5DB'}
            borderWidth={1}
            borderRadius={tokens.radius[3].val}
        />
    );
};

export default FormTextArea;

