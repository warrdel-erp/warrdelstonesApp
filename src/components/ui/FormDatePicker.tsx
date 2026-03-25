import React from 'react';
import { View } from 'react-native';
import { getTokens, useTheme } from 'tamagui';
import DatePicker from './DatePicker';

export interface FormDatePickerProps {
    value?: Date | string | null;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    hasError?: boolean;
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({
    value,
    onChange,
    placeholder,
    disabled = false,
    error = false,
    hasError = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    return (
        <View style={{ width: '100%' }}>
            <DatePicker
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                error={error}
                hasError={hasError}
            />
        </View>
    );
};

export default FormDatePicker;
