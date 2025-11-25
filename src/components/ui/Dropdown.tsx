import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Dimensions,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { theme } from '../../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BodyText, Button } from './index.tsx';

export interface DropdownOption<T = any> {
  id: number;
  label: string;
  value: T;
  disabled?: boolean;
}

export interface DropdownProps<T = any> {
  // Data and selection
  options: DropdownOption<T>[];
  value?: number | number[]; // Changed to use id instead of value
  onSelectionChange: (value: number | number[]) => void; // Changed to use id instead of value

  // Behavior
  multiSelect?: boolean;
  disabled?: boolean;
  searchable?: boolean;

  // Dropdown behavior
  maxHeight?: number;
  useBottomSheet?: boolean;
  itemHeight?: number;

  // Appearance
  placeholder?: string;
  style?: ViewStyle;
  dropdownStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: TextStyle & { size?: number };

  // Label
  label?: string;
  mandatory?: boolean;
  labelStyle?: TextStyle;

  // Multi-select behavior
  showDoneButton?: boolean;
  doneButtonText?: string;

  // Custom rendering
  renderItem?: (item: DropdownOption<T>, isSelected: boolean) => React.ReactNode;
  renderSelectedValue?: (value: T | T[]) => string;

  // Accessibility
  testID?: string;
}

export const Dropdown = <T,>({
  options,
  value,
  onSelectionChange,
  multiSelect = false,
  disabled = false,
  searchable = false,
  placeholder = 'Select an option',
  style,
  dropdownStyle,
  textStyle,
  iconStyle,
  label,
  mandatory = false,
  labelStyle,
  renderItem,
  renderSelectedValue,
  testID,
  maxHeight = 400,
  useBottomSheet = false,
  itemHeight = 48,
  showDoneButton = true,
  doneButtonText = 'Done',
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedItems, setTempSelectedItems] = useState<number[]>([]); // Changed to number[] for ids
  const screenHeight = Dimensions.get('window').height;

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(screenHeight)).current;

  // Filter options based on search text - searchable feature for future enhancement
  const filteredOptions = useMemo(() => {
    return options;
  }, [options]);

  // Calculate optimal height based on options count
  const calculateOptimalHeight = useCallback(() => {
    const headerHeight = useBottomSheet ? 80 : 40; // Increased header + padding
    const footerHeight = multiSelect && showDoneButton ? 80 : 20; // Footer for done button
    const maxVisibleItems = Math.floor((screenHeight * 0.6) / itemHeight);
    const optimalItems = Math.min(filteredOptions.length, maxVisibleItems);
    const calculatedHeight = optimalItems * itemHeight + headerHeight + footerHeight;

    if (useBottomSheet) {
      return Math.min(calculatedHeight, screenHeight * 0.8); // 80% max for bottom sheet
    }

    return Math.min(calculatedHeight, maxHeight);
  }, [
    filteredOptions.length,
    itemHeight,
    maxHeight,
    screenHeight,
    useBottomSheet,
    multiSelect,
    showDoneButton,
  ]);

  // Get selected items for multi-select
  const selectedItems = useMemo(() => {
    if (!multiSelect) return [];
    return Array.isArray(value) ? value : [];
  }, [value, multiSelect]);

  // Check if an item is selected - now using id comparison
  const isItemSelected = useCallback(
    (item: DropdownOption<T>) => {
      if (multiSelect) {
        return selectedItems.includes(item.id);
      }
      return value === item.id;
    },
    [value, selectedItems, multiSelect],
  );

  // Handle item selection - now using id
  const handleItemSelect = useCallback(
    (item: DropdownOption<T>) => {
      if (item.disabled) return;

      if (multiSelect) {
        if (showDoneButton) {
          // Use temp selection when Done button is enabled
          const isSelected = tempSelectedItems.includes(item.id);
          const newTempSelection = isSelected
            ? tempSelectedItems.filter(id => id !== item.id)
            : [...tempSelectedItems, item.id];
          setTempSelectedItems(newTempSelection);
        } else {
          // Direct update when Done button is not enabled
          const newSelection = isItemSelected(item)
            ? selectedItems.filter(id => id !== item.id)
            : [...selectedItems, item.id];
          onSelectionChange(newSelection);
        }
      } else {
        onSelectionChange(item.id);
        setIsOpen(false);
      }
    },
    [
      multiSelect,
      selectedItems,
      tempSelectedItems,
      isItemSelected,
      onSelectionChange,
      showDoneButton,
    ],
  );

  // Confirm selection in multi-select mode
  const handleConfirmSelection = useCallback(() => {
    onSelectionChange(tempSelectedItems);
    closeModal();
  }, [onSelectionChange, tempSelectedItems]);

  // Get display text - now using id comparison
  const getDisplayText = useCallback(() => {
    if (renderSelectedValue) {
      // Get actual values for the selected ids to pass to renderSelectedValue
      const selectedValues = multiSelect
        ? options.filter(opt => selectedItems.includes(opt.id)).map(opt => opt.value)
        : options.find(opt => opt.id === value)?.value;
      return renderSelectedValue(selectedValues as T | T[]);
    }

    if (multiSelect) {
      const count = selectedItems.length;
      if (count === 0) return placeholder;
      if (count === 1) {
        const selected = options.find(opt => opt.id === selectedItems[0]);
        return selected?.label || placeholder;
      }
      return options
        .filter(opt => selectedItems.includes(opt.id))
        .map(opt => opt.label)
        .join(', ');
    }

    const selectedOption = options.find(opt => opt.id === value);
    return selectedOption?.label || placeholder;
  }, [value, selectedItems, multiSelect, placeholder, options, renderSelectedValue]);

  // Render dropdown item
  const renderDropdownItem = ({ item }: { item: DropdownOption<T> }) => {
    const isSelected = isItemSelected(item);

    if (renderItem) {
      return (
        <TouchableOpacity
          style={[
            styles.dropdownItem,
            item.disabled && styles.dropdownItemDisabled,
            isSelected && styles.dropdownItemSelected,
          ]}
          onPress={() => handleItemSelect(item)}
          disabled={item.disabled}>
          {renderItem(item, isSelected)}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          item.disabled && styles.dropdownItemDisabled,
          isSelected && styles.dropdownItemSelected,
        ]}
        onPress={() => handleItemSelect(item)}
        disabled={item.disabled}>
        <BodyText
          style={[
            styles.dropdownItemText,
            item.disabled && styles.dropdownItemTextDisabled,
            isSelected && styles.dropdownItemTextSelected,
          ]}>
          {item.label}
        </BodyText>
        {isSelected && <Icon name={'check'} size={24} color={theme.colors.white} />}
      </TouchableOpacity>
    );
  };

  const isPlaceholder = multiSelect ? selectedItems.length === 0 : !value;

  // Open/Close animations
  const openModal = useCallback(() => {
    setIsOpen(true);

    // Change status bar to light content when bottom sheet opens (for dark backdrop)
    if (useBottomSheet && Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', true);
    }

    if (useBottomSheet) {
      // Reset values first
      backdropOpacity.setValue(0);
      sheetTranslateY.setValue(screenHeight);

      // Then animate
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [backdropOpacity, sheetTranslateY, useBottomSheet, screenHeight]);

  const closeModal = useCallback(() => {
    // Restore status bar to dark content when bottom sheet closes
    if (useBottomSheet && Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content', true);
    }

    if (useBottomSheet) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsOpen(false);
      });
    } else {
      setIsOpen(false);
    }
  }, [backdropOpacity, sheetTranslateY, useBottomSheet, screenHeight]);

  // Initialize animation values
  useEffect(() => {
    if (useBottomSheet) {
      sheetTranslateY.setValue(screenHeight);
      backdropOpacity.setValue(0);
    }
  }, [useBottomSheet, sheetTranslateY, backdropOpacity, screenHeight]);

  // Check if temp item is selected (for multi-select with Done button) - now using id
  const isTempItemSelected = useCallback(
    (item: DropdownOption<T>) => {
      if (multiSelect && showDoneButton) {
        return tempSelectedItems.includes(item.id);
      }
      return isItemSelected(item);
    },
    [multiSelect, showDoneButton, tempSelectedItems, isItemSelected],
  );

  // Initialize temp selection when modal opens
  useEffect(() => {
    if (isOpen && multiSelect && showDoneButton) {
      setTempSelectedItems(selectedItems);
    }
  }, [isOpen, multiSelect, showDoneButton, selectedItems]);

  return (
    <View>
      {/* Render label if provided */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {mandatory && <Text style={styles.mandatory}> *</Text>}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.container,
          !disabled && isOpen && styles.containerFocused,
          disabled && styles.containerDisabled,
          style,
        ]}
        onPress={() => !disabled && openModal()}
        disabled={disabled}
        testID={testID}>
        <Text
          style={[
            styles.text,
            isPlaceholder && styles.placeholderText,
            disabled && styles.textDisabled,
            textStyle,
          ]}
          numberOfLines={1}>
          {getDisplayText()}
        </Text>
        {/*<Text style={[styles.arrow, disabled && styles.arrowDisabled, isOpen && styles.arrowOpen]}>*/}
        {/*  ▼*/}
        {/*</Text>*/}
        <Icon
          style={[styles.arrow, disabled && styles.arrowDisabled, iconStyle]}
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={iconStyle?.size ?? 24}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType={useBottomSheet ? 'none' : 'fade'}
        onRequestClose={closeModal}>
        {useBottomSheet ? (
          // Bottom Sheet with custom animations
          <View style={styles.bottomSheetContainer}>
            <Animated.View style={[styles.bottomSheetBackdrop, { opacity: backdropOpacity }]} />
            <Pressable style={styles.bottomSheetBackdropTouchable} onPress={closeModal} />
            <Animated.View
              style={[
                styles.bottomSheetContent,
                {
                  height: calculateOptimalHeight(),
                  transform: [{ translateY: sheetTranslateY }],
                },
                dropdownStyle,
              ]}>
              <View style={styles.bottomSheetHeader}>
                <View style={styles.bottomSheetHandle} />
                <View style={styles.bottomSheetHeaderContent}>
                  {label && (
                    <Text style={styles.bottomSheetTitle}>
                      {label}
                      {mandatory && <Text style={styles.mandatory}> *</Text>}
                    </Text>
                  )}
                  <Icon
                    name={'close'}
                    size={24}
                    color={theme.colors.text.primary}
                    onPress={closeModal}
                  />
                </View>
              </View>
              <FlatList
                data={filteredOptions}
                renderItem={({ item }) => {
                  const isSelected = isTempItemSelected(item);

                  if (renderItem) {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.dropdownItem,
                          item.disabled && styles.dropdownItemDisabled,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                        onPress={() => handleItemSelect(item)}
                        disabled={item.disabled}>
                        {renderItem(item, isSelected)}
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        item.disabled && styles.dropdownItemDisabled,
                        isSelected && styles.dropdownItemSelected,
                      ]}
                      onPress={() => handleItemSelect(item)}
                      disabled={item.disabled}>
                      <BodyText
                        style={[
                          styles.dropdownItemText,
                          item.disabled && styles.dropdownItemTextDisabled,
                          isSelected && styles.dropdownItemTextSelected,
                        ]}>
                        {item.label}
                      </BodyText>
                      {isSelected && <Icon name={'check'} size={24} color={theme.colors.white} />}
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => `${item.value}-${index}`}
                style={[styles.bottomSheetList]}
                contentContainerStyle={{
                  paddingBottom: theme.spacing.md,
                  flexGrow: 1,
                }}
                showsVerticalScrollIndicator={true}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                nestedScrollEnabled
                getItemLayout={(data, index) => ({
                  length: itemHeight,
                  offset: itemHeight * index,
                  index,
                })}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
              {multiSelect && showDoneButton && (
                <View style={styles.bottomSheetFooter}>
                  <Button
                    style={{ flex: 1 }}
                    variant={'outline'}
                    onPress={closeModal}
                    title={'Close'}
                  />
                  <Button
                    style={{ flex: 1 }}
                    onPress={handleConfirmSelection}
                    title={doneButtonText}
                  />
                </View>
              )}
            </Animated.View>
          </View>
        ) : (
          // Regular dropdown
          <Pressable style={styles.overlay} onPress={closeModal}>
            <View style={[styles.dropdown, dropdownStyle, { maxHeight: calculateOptimalHeight() }]}>
              <FlatList
                data={filteredOptions}
                renderItem={renderDropdownItem}
                keyExtractor={(item, index) => `${item.value}-${index}`}
                style={[styles.dropdownList, { maxHeight: calculateOptimalHeight() - 20 }]}
                showsVerticalScrollIndicator={true}
                // ItemSeparatorComponent={() => <View style={styles.separator} />}
                nestedScrollEnabled
                getItemLayout={(data, index) => ({
                  length: itemHeight,
                  offset: itemHeight * index,
                  index,
                })}
                initialNumToRender={10}
                maxToRenderPerBatch={20}
                windowSize={10}
              />
            </View>
          </Pressable>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.dark,
    borderRadius: theme.borderRadius.md,
    minHeight: 44,
  },
  containerDisabled: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border.dark,
  },
  containerFocused: { borderColor: theme.colors.primary, borderWidth: 2 },
  text: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  placeholderText: {
    color: theme.colors.text.disabled,
  },
  textDisabled: {
    color: theme.colors.text.disabled,
  },
  arrow: {
    color: theme.colors.primaryDark,
    marginLeft: theme.spacing.sm,
  },
  arrowDisabled: {
    color: theme.colors.text.disabled,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  dropdown: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    maxHeight: 300,
    width: '100%',
    ...theme.shadows.md,
  },
  dropdownList: {
    maxHeight: 280,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minHeight: 44,
  },
  dropdownItemDisabled: {
    opacity: 0.5,
  },
  dropdownItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  dropdownItemText: {
    flex: 1,
    color: theme.colors.text.primary,
  },
  dropdownItemTextDisabled: {
    color: theme.colors.text.disabled,
  },
  dropdownItemTextSelected: {
    color: theme.colors.white,
  },
  checkmark: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  separator: {
    height: theme.spacing.sm,
    backgroundColor: theme.colors.transparent,
  },
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
    fontWeight: 'bold',
  },
  // Bottom Sheet Styles
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingHorizontal: 0,
  },
  bottomSheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomSheetBackdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    width: '100%',
    maxHeight: '80%',
    // paddingBottom: 20,
    ...theme.shadows.md,
  },
  bottomSheetHeader: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  bottomSheetHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeIcon: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border.medium,
    marginBottom: theme.spacing.sm,
  },
  bottomSheetTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.semiBold,
    textAlign: 'center',
  },
  bottomSheetList: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  bottomSheetFooter: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: theme.spacing.md,
    borderTopColor: theme.colors.border.light,
    // alignItems: 'center',
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  doneButtonText: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});

export default Dropdown;
