import { Check, ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import { Modal, ScrollView, TouchableOpacity } from 'react-native';
import {
    Select,
    Text,
    XStack,
    YStack,
    getTokens,
    useTheme
} from 'tamagui';
import { useAsyncLoader } from '../../hooks';
import { services } from '../../network';
import Spinner from './Spinner';

export interface DropdownOption<T = any> {
    id: number;
    label: string;
    value: T;
    disabled?: boolean;
}

export interface SelectDropdownProps<T = any> {
    /** Dropdown options - either provide options directly or use endpoint to fetch */
    options?: DropdownOption<T>[];
    /** API endpoint path (e.g., 'services' for /api/options/services) */
    endpoint?: string;
    /** Query parameters for the API call */
    queryParams?: Record<string, any>;
    /** Selected value(s) - for single select: the option value, for multi-select: array of option values */
    value?: T | T[];
    /** Callback when selection changes */
    onSelectionChange: (value: T | T[]) => void;
    /** Enable multi-select */
    multiSelect?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
}


export const SelectDropdown = <T,>({
    options: providedOptions,
    endpoint,
    queryParams,
    value,
    onSelectionChange,
    multiSelect = false,
    disabled = false,
    placeholder = 'Select an option',
}: SelectDropdownProps<T>) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [fetchedOptions, setFetchedOptions] = React.useState<DropdownOption<T>[]>([]);

    // Fetch options from API if endpoint is provided
    const fetchOptions = React.useCallback(async () => {
        if (!endpoint) return;

        const response = await services.common.getOptions(endpoint, queryParams);

        // Handle service-level errors (network, HTTP errors)
        if (!response.success && response.error) {
            throw new Error('Failed to fetch options');
        }

        // Handle API-level errors (when API returns success: false)
        if (response.success && response.data) {
            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to fetch options');
            }

            // Transform API response to DropdownOption format
            // response.data is the API response object: { success, message, data: [...] }
            if (response.data.data && Array.isArray(response.data.data)) {
                const transformedOptions: DropdownOption<T>[] = response.data.data.map((item, index) => ({
                    id: typeof item.value === 'number' ? item.value : index + 1,
                    label: item.label,
                    value: item.value,
                }));
                setFetchedOptions(transformedOptions);
            } else {
                setFetchedOptions([]);
            }
        }
    }, [endpoint, queryParams]);

    const { loading, error, run } = useAsyncLoader(fetchOptions);

    // Fetch options on mount or when endpoint/queryParams change
    React.useEffect(() => {
        if (endpoint) {
            run();
        }
    }, [endpoint, JSON.stringify(queryParams), run]);

    // Use fetched options if endpoint is provided, otherwise use provided options
    const options = endpoint ? fetchedOptions : (providedOptions || []);

    // For single select, find the selected option
    const selectedOption = React.useMemo(() => {
        if (!value) return null;
        if (multiSelect) {
            // For multi-select, value is an array
            const selectedValues = Array.isArray(value) ? value : [value];
            return options.filter((opt) => selectedValues.includes(opt.value));
        } else {
            // For single select, find the option with matching value
            return options.find((opt) => opt.value === value) || null;
        }
    }, [value, options, multiSelect]);

    // Get display text
    const displayText = React.useMemo(() => {
        if (!selectedOption) return placeholder;
        if (multiSelect && Array.isArray(selectedOption)) {
            if (selectedOption.length === 0) return placeholder;
            if (selectedOption.length === 1) return selectedOption[0].label;
            return `${selectedOption.length} selected`;
        }
        return (selectedOption as DropdownOption<T>).label;
    }, [selectedOption, placeholder, multiSelect]);

    const handleSelect = (selectedValue: T) => {
        if (multiSelect) {
            const currentValues = Array.isArray(value) ? value : value ? [value] : [];
            const isSelected = currentValues.includes(selectedValue);
            if (isSelected) {
                // Remove from selection
                const newValues = currentValues.filter((v) => v !== selectedValue);
                onSelectionChange(newValues);
            } else {
                // Add to selection
                onSelectionChange([...currentValues, selectedValue]);
            }
        } else {
            onSelectionChange(selectedValue);
        }
    };

    const isSelected = (optionValue: T) => {
        if (multiSelect) {
            const currentValues = Array.isArray(value) ? value : value ? [value] : [];
            return currentValues.includes(optionValue);
        }
        return value === optionValue;
    };

    // For single select, use the value directly. For multi-select, we'll handle it manually
    const selectValue = React.useMemo(() => {
        if (multiSelect) {
            // For multi-select, we don't use Select's value prop
            return undefined;
        }
        if (!value) return undefined;
        const option = options.find((opt) => opt.value === value);
        return option ? String(option.value) : undefined;
    }, [value, options, multiSelect]);

    return (
        <Select
            value={selectValue}
            open={open}
            onOpenChange={setOpen}
            onValueChange={(val) => {
                if (!multiSelect && !disabled) {
                    const option = options.find((opt) => String(opt.value) === val);
                    if (option) {
                        handleSelect(option.value);
                        setOpen(false);
                    }
                }
            }}
            disablePreventBodyScroll
        >
            <Select.Trigger
                width="100%"
                borderWidth={1}
                borderRadius={tokens.radius[3].val}
                borderColor={theme.borderMedium?.val || '#E5E7EB'}
                backgroundColor={disabled ? theme.backgroundHover?.val || '#F9FAFB' : theme.background?.val || '#FFFFFF'}
                paddingHorizontal={tokens.space[3].val}
                paddingVertical={tokens.space[2].val}
                opacity={disabled || loading ? 0.6 : 1}
                pointerEvents={disabled || loading ? 'none' : 'auto'}
                onPress={() => {
                    if (!disabled && !loading) {
                        setOpen(true);
                    }
                }}
            >
                <XStack flex={1} alignItems="center" gap={tokens.space[2].val}>
                    {loading ? (
                        <XStack flex={1} alignItems="center" gap={tokens.space[2].val}>
                            <Spinner size="small" message='Loading...' />
                        </XStack>
                    ) : error ? (
                        <Text
                            flex={1}
                            fontSize={tokens.size[3.5].val}
                            color={theme.statusError?.val || '#DC2626'}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            Error occurred
                        </Text>
                    ) : (
                        <XStack flex={1} minWidth={0}>
                            <Text
                                flex={1}
                                fontSize={tokens.size[3.5].val}
                                color={
                                    selectedOption
                                        ? theme.textPrimary?.val || '#111827'
                                        : theme.textCaption?.val || '#9CA3AF'
                                }
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {displayText || placeholder}
                            </Text>
                        </XStack>
                    )}
                    {!loading && (
                        <Select.Icon flexShrink={0}>
                            <ChevronDown
                                size={20}
                                color={theme.textCaption?.val || '#9CA3AF'}
                            />
                        </Select.Icon>
                    )}
                </XStack>
            </Select.Trigger>

            {open && (
                <Modal
                    visible={open}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOpen(false)}
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
                        onPress={() => setOpen(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                            style={{
                                backgroundColor: theme.background?.val || '#FFFFFF',
                                borderRadius: tokens.radius[4].val,
                                width: '100%',
                                maxWidth: 400,
                                maxHeight: '70%',
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
                            <ScrollView>
                                <YStack padding={tokens.space[4].val}>
                                    {loading ? (
                                        <YStack
                                            padding={tokens.space[4].val}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Spinner size="medium" message="Loading options..." />
                                        </YStack>
                                    ) : error ? (
                                        <YStack
                                            padding={tokens.space[4].val}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Text
                                                fontSize={tokens.size[3.5].val}
                                                color={theme.statusError?.val || '#DC2626'}
                                            >
                                                {error?.message || 'Failed to load options'}
                                            </Text>
                                        </YStack>
                                    ) : options.length === 0 ? (
                                        <YStack
                                            padding={tokens.space[4].val}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Text
                                                fontSize={tokens.size[3.5].val}
                                                color={theme.textCaption?.val || '#9CA3AF'}
                                            >
                                                No options available
                                            </Text>
                                        </YStack>
                                    ) : (
                                        <YStack gap={tokens.space[1].val}>
                                            {options.map((option) => {
                                                const optionIsSelected = isSelected(option.value);

                                                return (
                                                    <TouchableOpacity
                                                        key={option.id}
                                                        onPress={() => {
                                                            handleSelect(option.value);
                                                            if (!multiSelect) {
                                                                setOpen(false);
                                                            }
                                                        }}
                                                        disabled={option.disabled}
                                                        style={{
                                                            padding: tokens.space[3].val,
                                                            borderRadius: tokens.radius[2].val,
                                                            backgroundColor: optionIsSelected
                                                                ? theme.backgroundHover?.val || '#F9FAFB'
                                                                : 'transparent',
                                                            opacity: option.disabled ? 0.5 : 1,
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                        }}
                                                    >
                                                        <Text
                                                            fontSize={tokens.size[3.5].val}
                                                            color={
                                                                option.disabled
                                                                    ? theme.textCaption?.val || '#9CA3AF'
                                                                    : theme.textPrimary?.val || '#111827'
                                                            }
                                                        >
                                                            {option.label}
                                                        </Text>
                                                        {(multiSelect ? optionIsSelected : optionIsSelected) && (
                                                            <Check
                                                                size={16}
                                                                color={theme.primary?.val || '#0891B2'}
                                                            />
                                                        )}
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </YStack>
                                    )}
                                </YStack>
                            </ScrollView>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>
            )}

        </Select>
    );
};

export default SelectDropdown;

