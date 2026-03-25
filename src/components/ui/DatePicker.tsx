import { Calendar as CalendarIcon } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  Input,
  Text,
  XStack,
  YStack,
  getTokens,
  useTheme,
} from 'tamagui';

export interface DatePickerProps {
  value?: Date | string | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  hasError?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'dd-MM-yyyy',
  disabled = false,
  error = false,
  hasError = false,
}) => {
  const tokens = getTokens();
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const showError = error || hasError;

  const dateValue: Date = value instanceof Date ? value : value ? new Date(value) : new Date();

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatForCalendar = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const displayText = value ? formatDate(new Date(value)) : '';
  const displayPlaceholder = placeholder || 'dd-MM-yyyy';

  const onDayPress = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    onChange(selectedDate);
    setShowPicker(false);
  };

  return (
    <YStack width="100%">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <XStack
          width="100%"
          borderWidth={1}
          borderRadius={tokens.radius[3].val}
          borderColor={showError ? theme.statusError?.val || '#DC2626' : theme.borderMedium?.val || '#E5E7EB'}
          backgroundColor={disabled ? theme.backgroundHover?.val || '#F9FAFB' : theme.background?.val || '#FFFFFF'}
          alignItems="center"
          overflow="hidden"
          opacity={disabled ? 0.6 : 1}
          paddingHorizontal={tokens.space[3].val}
          paddingVertical={tokens.space[2].val}
          minHeight={tokens.size[4].val}
        >
          <Input
            flex={1}
            value={displayText}
            placeholder={displayPlaceholder}
            placeholderTextColor={theme.textCaption?.val || '#9CA3AF'}
            editable={false}
            pointerEvents="none"
            fontSize={tokens.size[3.5].val}
            color={
              value
                ? theme.textPrimary?.val || '#111827'
                : theme.textCaption?.val || '#9CA3AF'
            }
            borderWidth={0}
            backgroundColor="transparent"
            paddingHorizontal={0}
            paddingVertical={0}
          />
          <XStack
            backgroundColor={theme.backgroundHover?.val || '#F3F4F6'}
            paddingHorizontal={tokens.space[3].val}
            paddingVertical={tokens.space[2].val}
            alignItems="center"
            justifyContent="center"
            borderLeftWidth={1}
            borderLeftColor={theme.borderMedium?.val || '#E5E7EB'}
            marginLeft={tokens.space[2].val}
            marginRight={-tokens.space[3].val}
            marginVertical={-tokens.space[2].val}
          >
            <CalendarIcon
              size={20}
              color={theme.textCaption?.val || '#9CA3AF'}
            />
          </XStack>
        </XStack>
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: tokens.space[4].val,
          }}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <YStack
            backgroundColor={theme.background?.val || '#FFFFFF'}
            borderRadius={tokens.radius[4].val}
            width="100%"
            maxWidth={400}
            padding={tokens.space[4].val}
            elevation={5}
            gap={tokens.space[3].val}
          >
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={tokens.size[4.5].val} fontWeight="600">Select Date</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Text color={theme.blue8?.val || '#3B82F6'} fontWeight="600">Cancel</Text>
              </TouchableOpacity>
            </XStack>
            <Calendar
              current={formatForCalendar(dateValue)}
              onDayPress={onDayPress}
              markedDates={{
                [formatForCalendar(dateValue)]: { selected: true, selectedColor: theme.blue8?.val || '#3B82F6' }
              }}
              theme={{
                selectedDayBackgroundColor: theme.blue8?.val || '#3B82F6',
                todayTextColor: theme.blue8?.val || '#3B82F6',
                arrowColor: theme.blue8?.val || '#3B82F6',
              }}
            />
          </YStack>
        </TouchableOpacity>
      </Modal>
    </YStack>
  );
};

export default DatePicker;
