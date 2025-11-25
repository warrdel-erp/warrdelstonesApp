import React, { useState, useCallback, forwardRef } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
  KeyboardType,
} from 'react-native';
import { theme } from '../../theme';

export interface TextInputProps extends Omit<RNTextInputProps, 'keyboardType'> {
  // Label
  label?: string;
  mandatory?: boolean;
  labelStyle?: TextStyle;

  // Input behavior
  inputType?: 'text' | 'email' | 'phone' | 'number';
  multiline?: boolean;
  disabled?: boolean;

  // Appearance
  placeholder?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;

  // Error handling
  error?: string;
  errorStyle?: TextStyle;

  // Container styling
  containerStyle?: ViewStyle;

  // Accessibility
  testID?: string;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      mandatory = false,
      labelStyle,
      inputType = 'text',
      multiline = false,
      disabled = false,
      placeholder,
      style,
      inputStyle,
      error,
      errorStyle,
      containerStyle,
      testID,
      value,
      onChangeText,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Get keyboard type based on input type
    const getKeyboardType = useCallback((): KeyboardType => {
      switch (inputType) {
        case 'email':
          return 'email-address';
        case 'phone':
          return 'phone-pad';
        case 'number':
          return 'numeric';
        default:
          return 'default';
      }
    }, [inputType]);

    // Get auto capitalize based on input type
    const getAutoCapitalize = useCallback(() => {
      switch (inputType) {
        case 'email':
          return 'none';
        case 'phone':
        case 'number':
          return 'none';
        default:
          return 'sentences';
      }
    }, [inputType]);

    // Get auto correct based on input type
    const getAutoCorrect = useCallback(() => {
      switch (inputType) {
        case 'email':
        case 'phone':
        case 'number':
          return false;
        default:
          return true;
      }
    }, [inputType]);

    // Handle focus
    const handleFocus = useCallback(
      (e: any) => {
        setIsFocused(true);
        props.onFocus?.(e);
      },
      [props],
    );

    // Handle blur
    const handleBlur = useCallback(
      (e: any) => {
        setIsFocused(false);
        props.onBlur?.(e);
      },
      [props],
    );

    // Check if input has value
    const hasValue = value && value.length > 0;
    const hasError = error && error.length > 0;

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && (
          <View style={styles.labelContainer}>
            <Text style={[styles.label, labelStyle]}>
              {label}
              {mandatory && <Text style={styles.mandatory}> *</Text>}
            </Text>
          </View>
        )}

        {/* Input Container */}
        <View
          style={[
            styles.inputContainer,
            multiline && styles.multilineContainer,
            isFocused && styles.inputContainerFocused,
            hasError && styles.inputContainerError,
            disabled && styles.inputContainerDisabled,
            style,
          ]}>
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              multiline && styles.multilineInput,
              disabled && styles.inputDisabled,
              inputStyle,
            ]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.disabled}
            keyboardType={getKeyboardType()}
            autoCapitalize={getAutoCapitalize()}
            autoCorrect={getAutoCorrect()}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? 'top' : 'center'}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            testID={testID}
            {...props}
          />
        </View>

        {/* Error Message */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, errorStyle]}>{error}</Text>
          </View>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  mandatory: {
    color: theme.colors.status.error,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },
  multilineContainer: {
    minHeight: 100,
    paddingVertical: theme.spacing.md,
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: theme.colors.status.error,
    borderWidth: 2,
  },
  inputContainerDisabled: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border.dark,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    padding: 0,
    margin: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  inputDisabled: {
    color: theme.colors.text.disabled,
  },
  errorContainer: {
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    fontFamily: theme.typography.fontFamily.regular,
  },
});

export default TextInput;
