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

    // Use local string state for intermediate values
    const [localValue, setLocalValue] = React.useState<string>(value?.toString() ?? '');

    // Synchronize localValue with value prop when value changes
    React.useEffect(() => {
        const propString = value?.toString() ?? '';
        const propNum = value !== undefined && value !== null ? Number(value) : NaN;
        const localNum = localValue !== '' ? Number(localValue) : NaN;

        // Only update localValue if the actual numerical value is different
        // This prevents overwriting intermediate typing like "12." or "12.0"
        if (Number.isNaN(propNum) && Number.isNaN(localNum)) {
            if (localValue !== propString) {
                setLocalValue(propString);
            }
        } else if (propNum !== localNum) {
            setLocalValue(propString);
        }
    }, [value]);

    const handleChange = (text: string) => {
        setLocalValue(text);
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
                value={localValue}
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

