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
}

export const FormTextInput: React.FC<FormTextInputProps> = ({
    value,
    onChange,
    placeholder,
    type = 'text',
    disabled = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

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
                // paddingVertical={tokens.space[4].val}
                fontSize={tokens.size[3.5].val}
                flex={1}
                height={37}
                backgroundColor={theme.background?.val}
                editable={!disabled}
                opacity={disabled ? 0.6 : 1}
                onChangeText={handleChange}
            />
        </View>
    );
};

export default FormTextInput;

