import React from 'react';
import { View } from 'react-native';
import {
    Input,
    getTokens,
    useTheme,
} from 'tamagui';

export interface FormTextInputProps {
    value?: string | number | null;
    onChange: (value: string | number | undefined) => void;
    placeholder?: string;
    type?: 'text' | 'number';
    disabled?: boolean;
    error?: boolean;
    hasError?: boolean;
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
    error = false,
    hasError = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const showError = error || hasError;

    const handleChange = (text: string) => {
        if (type === 'number') {
            const numericValue = text === '' ? undefined : Number(text);
            onChange(Number.isNaN(numericValue) ? undefined : numericValue);
        } else {
            onChange(text);
        }
    };

    return (
        <View style={{ minHeight: tokens.size[4].val, width: '100%' }}>
            <Input
                value={value?.toString() ?? ''}
                placeholder={placeholder || 'Type here'}
                keyboardType={type === 'number' ? 'numeric' : 'default'}
                paddingHorizontal={tokens.space[3].val}
                fontSize={tokens.size[3.5].val}
                flex={1}
                height={37}
                backgroundColor={theme.background?.val}
                editable={!disabled}
                opacity={disabled ? 0.6 : 1}
                onChangeText={handleChange}
                borderColor={showError ? theme.statusError?.val || '#DC2626' : theme.borderMedium?.val || '#D1D5DB'}
                borderWidth={1}
                borderRadius={tokens.radius[3].val}
            />
        </View>
    );
};

export default FormTextInput;

