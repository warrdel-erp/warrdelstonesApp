import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import {
    Switch,
    Text,
    XStack,
    YStack,
    getTokens,
    useTheme
} from 'tamagui';
import FormDatePicker from './FormDatePicker';
import FormFieldWrapper from './FormFieldWrapper';
import FormTextArea from './FormTextArea';
import FormTextInput from './FormTextInput';
import SelectDropdown, { DropdownOption } from './SelectDropdown';
import FormSwitch from './FormSwitch';

export type FormFieldType =
    | 'text'
    | 'number'
    | 'textarea'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'dropdown';

export interface FormFieldConfig {
    name: string;
    type: FormFieldType;
    label: string;
    placeholder?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    width?: string | number;
    /** Dropdown options when type is 'dropdown' - either provide options directly or use endpoint to fetch */
    options?: DropdownOption<any>[];
    /** API endpoint path (e.g., 'services' for /api/options/services) - fetches options from API */
    endpoint?: string;
    /** Query parameters for the API call when using endpoint */
    queryParams?: Record<string, any>;
    /** Enable multi-select for dropdown */
    multiSelect?: boolean;
    /** Automatically select the first option when options are loaded */
    selectFirstByDefault?: boolean;
    /** Custom validation rules for react-hook-form */

    rules?: {
        required?: boolean | string;
        min?: number | { value: number; message: string };
        max?: number | { value: number; message: string };
        pattern?: { value: RegExp; message: string };
        validate?: (value: any) => boolean | string;
        [key: string]: any;
    };
}

export interface FormSectionConfig {
    id: string;
    title?: string;
    description?: string;
    fields: FormFieldConfig[];
}

export interface FormRendererProps {
    sections: FormSectionConfig[];
    /** React Hook Form form object from useForm() */
    form: UseFormReturn<any>;
}

export const FormRenderer: React.FC<FormRendererProps> = ({
    sections,
    form,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const { control, formState } = form;

    const renderFieldInput = (field: FormFieldConfig, value: any, onChange: (value: any) => void, hasError: boolean, isDisabled?: boolean) => {
        const disabled = field.disabled || isDisabled;

        switch (field.type) {
            case 'text':
            case 'number':
                return (
                    <FormTextInput
                        value={value}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        type={field.type}
                        hasError={hasError}
                        disabled={disabled}
                    />

                );

            case 'textarea':
                return (
                    <FormTextArea
                        value={value}
                        onChange={onChange}
                        placeholder={field.placeholder}
                        hasError={hasError}
                        disabled={disabled}
                    />

                );

            case 'checkbox':
                return (
                    <XStack alignItems="center" gap={tokens.space[2].val}>
                        <FormSwitch
                            size="$3"
                            checked={!!value}
                            onCheckedChange={(checked) => onChange(checked)}
                            disabled={disabled}
                        />
                        <Text
                            fontSize={tokens.size[3.5].val}
                            color={theme.textPrimary?.val || '#111827'}
                            opacity={disabled ? 0.6 : 1}
                        >
                            {field.placeholder || field.label}
                        </Text>
                    </XStack>

                );


            case 'switch':
                return (
                    <FormSwitch
                        size="$3"
                        checked={!!value}
                        onCheckedChange={(checked) => onChange(checked)}
                        disabled={disabled}
                    />

                );


            case 'dropdown': {
                return (
                    <SelectDropdown
                        options={field.options}
                        endpoint={field.endpoint}
                        queryParams={field.queryParams}
                        value={value}
                        onSelectionChange={(val) => onChange(val)}
                        multiSelect={field.multiSelect}
                        placeholder={field.placeholder}
                        hasError={hasError}
                        disabled={disabled}
                        selectFirstByDefault={field.selectFirstByDefault}
                    />


                );
            }

            case 'date': {
                return (
                    <FormDatePicker
                        value={value}
                        onChange={(date: Date | undefined) => onChange(date)}
                        placeholder={field.placeholder}
                        hasError={hasError}
                        disabled={disabled}
                    />

                );
            }


            default:
                return <Text>Unknown field type: {field.type}</Text>;
        }
    };

    const renderSection = (section: FormSectionConfig) => {
        if (!section.fields || section.fields.length === 0) {
            return null;
        }

        return (
            <YStack
                key={section.id}
                marginBottom={tokens.space[5].val}
                padding={tokens.space[4].val}
                borderRadius={tokens.radius[4].val}
                backgroundColor={theme.background?.val || '#FFFFFF'}
            >
                {(section.title || section.description) && (
                    <YStack marginBottom={tokens.space[3].val} gap={tokens.space[1].val}>
                        {section.title && (
                            <Text
                                fontSize={tokens.size[5].val}
                                fontWeight="600"
                                color={theme.textPrimary?.val || '#111827'}
                            >
                                {section.title}
                            </Text>
                        )}
                        {section.description && (
                            <Text
                                fontSize={tokens.size[3.5].val}
                                color={theme.textCaption?.val || '#6B7280'}
                            >
                                {section.description}
                            </Text>
                        )}
                    </YStack>
                )}

                <XStack
                    flexWrap="wrap"
                    gap={tokens.space[3].val}
                >
                    {section.fields.map((field) => {
                        const width = field.width ?? '48%';
                        const fieldError = formState.errors[field.name];
                        const errorMessage = fieldError?.message as string | undefined;
                        const hasError = !!errorMessage;

                        return (
                            <FormFieldWrapper
                                key={field.name}
                                label={field.label}
                                required={field.required}
                                helperText={field.helperText}
                                error={errorMessage}
                                width={width}
                            >
                                <Controller
                                    name={field.name}
                                    control={control}
                                    render={({ field: { value, onChange, disabled: controllerDisabled } }) => {
                                        const input = renderFieldInput(field, value, onChange, hasError, controllerDisabled);
                                        return input || <Text>Unsupported field type</Text>;
                                    }}


                                />
                            </FormFieldWrapper>
                        );
                    })}
                </XStack>
            </YStack>
        );
    };

    if (!sections || sections.length === 0) {
        return null;
    }

    return <YStack gap={getTokens().space[4].val}>{sections.map(renderSection)}</YStack>;
};

export default FormRenderer;


