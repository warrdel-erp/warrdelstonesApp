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
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
    value,
    onChange,
    placeholder,
    numberOfLines = 4,
    disabled = false,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    return (
        <Input
            multiline
            numberOfLines={numberOfLines}
            value={value ?? ''}
            placeholder={placeholder || 'Type here'}
            paddingHorizontal={tokens.space[3].val}
            paddingVertical={tokens.space[2].val}
            // minHeight={100}
            fontSize={tokens.size[3.5].val}
            backgroundColor={theme.background?.val}
            textAlignVertical="top"
            editable={!disabled}
            width={'100%'}
            opacity={disabled ? 0.6 : 1}
            onChangeText={(text) => onChange(text || undefined)}
        />
    );
};

export default FormTextArea;

