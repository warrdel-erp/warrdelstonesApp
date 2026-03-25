import React from 'react';
import { Switch, YStack, getTokens, useTheme } from 'tamagui';

export interface FormSwitchProps {
    checked?: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    size?: any;
    error?: boolean;
    hasError?: boolean;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({
    checked = false,
    onCheckedChange,
    disabled = false,
    size = '$3',
    error = false,
    hasError = false,
}) => {
    const theme = useTheme();
    const tokens = getTokens();
    const showError = error || hasError;

    return (
        <YStack
            alignItems="center"
            justifyContent="center"
            opacity={disabled ? 0.6 : 1}
        >
            <Switch
                size={size}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                backgroundColor={checked ? theme.blue8?.val || '#3B82F6' : theme.gray5?.val || '#cfd2d8ff'}
                borderColor={showError ? theme.statusError?.val || '#DC2626' : 'transparent'}
            >
                <Switch.Thumb backgroundColor={theme.background?.val || '#FFFFFF'} transition="quickest" />
            </Switch>
        </YStack>
    );
};

export default FormSwitch;
