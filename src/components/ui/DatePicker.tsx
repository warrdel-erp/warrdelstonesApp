import React, { useState, useCallback, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface DatePickerProps {
  // Label
  label?: string;
  mandatory?: boolean;
  labelStyle?: TextStyle;

  // Date picker behavior
  value?: Date;
  onChange?: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;

  // Appearance
  placeholder?: string;
  style?: ViewStyle;
  dateFormat?: (date: Date) => string;

  // Error handling
  error?: string;
  errorStyle?: TextStyle;

  // Container styling
  containerStyle?: ViewStyle;

  // Accessibility
  testID?: string;
}

export const DatePicker = forwardRef<View, DatePickerProps>(
  (
    {
      label,
      mandatory = false,
      labelStyle,
      value,
      onChange,
      mode = 'date',
      minimumDate,
      maximumDate,
      disabled = false,
      placeholder = 'Select date',
      style,
      dateFormat,
      error,
      errorStyle,
      containerStyle,
      testID,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    // Default date formatter
    const defaultDateFormat = useCallback(
      (date: Date): string => {
        if (mode === 'time') {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (mode === 'datetime') {
          return date.toLocaleString();
        } else {
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        }
      },
      [mode],
    );

    const formatDate = dateFormat || defaultDateFormat;

    // Handle date selection
    const handleDateChange = useCallback(
      (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        setIsFocused(false);

        if (event.type === 'dismissed') {
          return;
        }

        if (selectedDate && onChange) {
          onChange(selectedDate);
        }
      },
      [onChange],
    );

    // Handle press to open picker
    const handlePress = useCallback(() => {
      if (disabled) return;

      setIsFocused(true);
      setShowPicker(true);
    }, [disabled]);

    const hasValue = value !== undefined && value !== null;
    const hasError = error && error.length > 0;

    // Get display text
    const displayText = hasValue ? formatDate(value) : placeholder;

    return (
      <View style={[styles.container, containerStyle]} ref={ref}>
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
        <TouchableOpacity
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            hasError && styles.inputContainerError,
            disabled && styles.inputContainerDisabled,
            style,
          ]}
          onPress={handlePress}
          disabled={disabled}
          testID={testID}
          activeOpacity={0.7}>
          {/* Display Text */}
          <Text
            style={[
              styles.input,
              !hasValue && styles.placeholderText,
              disabled && styles.inputDisabled,
            ]}>
            {displayText}
          </Text>

          <Icon
            name="event"
            size={24}
            color={
              disabled
                ? theme.colors.text.disabled
                : isFocused
                  ? theme.colors.primaryDark
                  : theme.colors.primaryLight
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Error Message */}
        {hasError && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, errorStyle]}>{error}</Text>
          </View>
        )}

        {/* Date Picker */}
        {showPicker && (
          <>
            {Platform.OS === 'android' && (
              <DateTimePicker
                value={value || new Date()}
                mode={mode === 'datetime' ? 'date' : mode}
                display={mode === 'time' ? 'clock' : 'spinner'}
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
            )}
            {Platform.OS === 'ios' && (
              <DateTimePicker
                value={value || new Date()}
                mode={mode}
                display="default"
                onChange={handleDateChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
            )}
          </>
        )}
      </View>
    );
  },
);

DatePicker.displayName = 'DatePicker';

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
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingRight: theme.spacing.sm,
  },
  placeholderText: {
    color: theme.colors.text.disabled,
  },
  inputDisabled: {
    color: theme.colors.text.disabled,
  },
  icon: {
    marginLeft: theme.spacing.xs,
  },
  errorContainer: {
    marginTop: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    fontFamily: theme.typography.fontFamily.regular,
  },
  iosPickerContainer: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    padding: theme.spacing.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosPickerWrapper: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    overflow: 'hidden',
  },
  iosPickerHeader: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  doneButton: {
    color: theme.colors.text.surface,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  iosPicker: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  pickerTitle: {
    color: theme.colors.text.surface,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
});

export default DatePicker;
