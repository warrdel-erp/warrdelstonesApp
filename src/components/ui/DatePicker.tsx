import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Modal, Platform, TouchableOpacity } from 'react-native';
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
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'dd-MM-yyyy',
  disabled = false,
}) => {
  const tokens = getTokens();
  const theme = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const dateValue: Date | undefined =
    value instanceof Date ? value : value ? new Date(value) : undefined;

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const displayText = dateValue ? formatDate(dateValue) : '';
  const displayPlaceholder = placeholder || 'dd-MM-yyyy';

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    }
  };

  const handleConfirm = () => {
    setShowPicker(false);
  };

  return (
    <YStack width="100%">
      <XStack
        width="100%"
        borderWidth={1}
        borderRadius={tokens.radius[3].val}
        borderColor={theme.borderMedium?.val || '#E5E7EB'}
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
            dateValue
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
          <TouchableOpacity
            onPress={() => !disabled && setShowPicker(true)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Calendar
              size={20}
              color={theme.textCaption?.val || '#9CA3AF'}
            />
          </TouchableOpacity>
        </XStack>
      </XStack>

      {Platform.OS === 'ios' ? (
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
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme.background?.val || '#FFFFFF',
                borderRadius: tokens.radius[4].val,
                width: '100%',
                maxWidth: 400,
                padding: tokens.space[4].val,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <YStack gap={tokens.space[3].val}>
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    fontSize={tokens.size[5].val}
                    fontWeight="600"
                    color={theme.textPrimary?.val || '#111827'}
                  >
                    Select Date
                  </Text>
                  <TouchableOpacity onPress={handleConfirm}>
                    <Text
                      fontSize={tokens.size[4].val}
                      color={theme.primary?.val || '#0891B2'}
                      fontWeight="600"
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </XStack>
                <DateTimePicker
                  value={dateValue || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                />
              </YStack>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={dateValue || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
          />
        )
      )}
    </YStack>
  );
};

export default DatePicker;
