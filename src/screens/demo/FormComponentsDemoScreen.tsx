import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, CheckBox, Container, DatePicker, Dropdown, Heading5, TextInput } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import theme from '../../theme';

const FormComponentsDemoScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');
    const [selectedDropdown, setSelectedDropdown] = useState<number | undefined>(undefined);

    const dropdownOptions = [
        { id: 1, label: 'Option 1', value: 1 },
        { id: 2, label: 'Option 2', value: 2 },
        { id: 3, label: 'Option 3', value: 3 },
    ];

    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Form Components</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.md }}>
                            <TextInput
                                label="Text Input"
                                placeholder="Enter text here"
                                value={textInputValue}
                                onChangeText={setTextInputValue}
                            />
                            <DatePicker
                                label="Date Picker"
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                            />
                            <Dropdown
                                label="Dropdown"
                                options={dropdownOptions}
                                value={selectedDropdown}
                                onSelectionChange={(value) => {
                                    if (typeof value === 'number') {
                                        setSelectedDropdown(value);
                                    }
                                }}
                            />
                            <CheckBox
                                title="Checkbox Option"
                                checked={checkboxValue}
                                onChange={(checked) => setCheckboxValue(checked.valueOf())}
                            />
                        </View>
                    </Card>
                </View>
            </Container>
        </BaseScreen>
    );
};

export default FormComponentsDemoScreen;

