import { Copy, Edit3, Info, Share2, Trash2 } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { YStack } from 'tamagui';
import {
    Accordion,
    AccordionGroup,
    BodyText,
    Button,
    Caption,
    Card,
    CheckBox,
    Container,
    DatePicker,
    Dropdown,
    Heading,
    Heading1,
    Heading4,
    Heading5,
    Heading6,
    Icon,
    IconButton,
    LabelValue,
    Separator,
    StatusBadge,
    Tabs,
    TextInput,
} from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { TabItem } from '../../components/ui/Tabs';
import theme from '../../theme';

const ComponentDemoScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [textInputValue, setTextInputValue] = useState('');
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedDropdown, setSelectedDropdown] = useState<number | undefined>(undefined);

    const dropdownOptions = [
        { id: 1, label: 'Option 1', value: 1 },
        { id: 2, label: 'Option 2', value: 2 },
        { id: 3, label: 'Option 3', value: 3 },
    ];

    const tabs: TabItem[] = [
        { id: 'tab1', label: 'Tab 1' },
        { id: 'tab2', label: 'Tab 2' },
        { id: 'tab3', label: 'Tab 3' },
    ];

    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
                {/* Icons Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Icons (Lucide from Tamagui)</Heading5>
                    <Card>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Home" size={22} color={theme.colors.primary} />
                                <Caption>Home</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="User" size={22} color={theme.colors.primary} />
                                <Caption>User</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Settings" size={22} color={theme.colors.primary} />
                                <Caption>Settings</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Search" size={22} color={theme.colors.primary} />
                                <Caption>Search</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Heart" size={22} color={theme.colors.primary} />
                                <Caption>Heart</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Bell" size={22} color={theme.colors.primary} />
                                <Caption>Bell</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Mail" size={22} color={theme.colors.primary} />
                                <Caption>Mail</Caption>
                            </View>
                            <View style={{ alignItems: 'center', gap: theme.spacing.xs }}>
                                <Icon name="Star" size={22} color={theme.colors.primary} />
                                <Caption>Star</Caption>
                            </View>
                        </View>
                        <View style={{ marginVertical: theme.spacing.md }}>
                            <Separator />
                        </View>
                        <View>
                            <Caption style={{ marginBottom: theme.spacing.sm }}>
                                Different Icon Families:
                            </Caption>
                            <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                <Icon name="home" family="MaterialIcons" size={22} color={theme.colors.primary} />
                                <Icon name="heart" family="FontAwesome" size={22} color={theme.colors.primary} />
                                <Icon name="ios-home" family="Ionicons" size={22} color={theme.colors.primary} />
                                <Icon name="home" family="Feather" size={22} color={theme.colors.primary} />
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Buttons Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Buttons</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.md }}>
                            <Button title="Primary Button" variant="primary" onPress={() => { }} />
                            <Button title="Secondary Button" variant="secondary" onPress={() => { }} />
                            <Button title="Outlined Button" variant="outline" onPress={() => { }} />
                            <Button title="Text Button" variant="text" onPress={() => { }} />
                            <Button title="Disabled Button" variant="primary" disabled onPress={() => { }} />
                            <Button
                                title="Button with Icon"
                                variant="primary"
                                icon={<Icon name="Plus" size={20} color={theme.colors.white} />}
                                onPress={() => { }}
                            />
                        </View>
                    </Card>
                </View>

                {/* Icon Buttons Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Icon Buttons</Heading5>
                    <Card>
                        <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                            <IconButton
                                iconName="home"
                                variant="primary"
                                size="small"
                                onPress={() => { }}
                            />
                            <IconButton
                                iconName="person"
                                variant="secondary"
                                size="medium"
                                onPress={() => { }}
                            />
                            <IconButton
                                iconName="settings"
                                variant="outlined"
                                size="large"
                                onPress={() => { }}
                            />
                            <IconButton
                                iconName="favorite"
                                variant="plain"
                                size="extraSmall"
                                onPress={() => { }}
                            />
                        </View>
                    </Card>
                </View>

                {/* Typography Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Typography (Deprecated)</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.sm }}>
                            <Heading1>Heading 1</Heading1>
                            <Heading4>Heading 2</Heading4>
                            <Heading4>Heading 3</Heading4>
                            <Heading4>Heading 4</Heading4>
                            <Heading5>Heading 5</Heading5>
                            <Heading6>Heading 6</Heading6>
                            <BodyText>Body Text - Regular paragraph text</BodyText>
                            <Caption>Caption - Smaller text for labels and captions</Caption>
                        </View>
                    </Card>
                </View>

                {/* New Heading Component Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Heading Component</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.lg }}>
                            {/* All Heading Levels */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    All Heading Levels:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={1}>Heading Level 1</Heading>
                                    <Heading level={2}>Heading Level 2</Heading>
                                    <Heading level={3}>Heading Level 3</Heading>
                                    <Heading level={4}>Heading Level 4</Heading>
                                    <Heading level={5}>Heading Level 5</Heading>
                                    <Heading level={6}>Heading Level 6</Heading>
                                </View>
                            </View>

                            <Separator />

                            {/* With Subheadings */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Subheadings:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={1} subheading="This is a subheading for H1">
                                        Main Heading
                                    </Heading>
                                    <Heading level={2} subheading="This is a subheading for H2">
                                        Main Heading
                                    </Heading>
                                    <Heading level={3} subheading="This is a subheading for H3">
                                        Main Heading
                                    </Heading>
                                    <Heading level={4} subheading="This is a subheading for H4">
                                        Main Heading
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            {/* With Icons */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Icons:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={3} icon="Home" subheading="Home icon with subheading">
                                        Home Section
                                    </Heading>
                                    <Heading level={4} icon="User" subheading="User icon with subheading">
                                        User Profile
                                    </Heading>
                                    <Heading level={4} icon="Settings" iconColor={theme.colors.primary}>
                                        Settings
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            {/* Alignments */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Text Alignments:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading level={4} alignment="left" subheading="Left aligned text">
                                        Left Aligned
                                    </Heading>
                                    <Heading level={4} alignment="center" subheading="Center aligned text">
                                        Center Aligned
                                    </Heading>
                                    <Heading level={4} alignment="right" subheading="Right aligned text">
                                        Right Aligned
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            {/* With Separator */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Separator:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading
                                        level={3}
                                        subheading="This heading has a separator below"
                                        showSeparator={true}>
                                        Section Title
                                    </Heading>
                                    <Heading
                                        level={4}
                                        subheading="Custom separator color"
                                        showSeparator={true}
                                        separatorColor={theme.colors.primary}>
                                        Another Section
                                    </Heading>
                                </View>
                            </View>

                            <Separator />

                            {/* Custom Colors */}
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Custom Colors:
                                </BodyText>
                                <View style={{ gap: theme.spacing.md }}>
                                    <Heading
                                        level={4}
                                        color={theme.colors.primary}
                                        subheading="Primary color heading"
                                        subheadingColor={theme.colors.text.secondary}>
                                        Primary Color
                                    </Heading>
                                    <Heading
                                        level={4}
                                        color={theme.colors.status.success}
                                        subheading="Success color heading">
                                        Success Color
                                    </Heading>
                                    <Heading
                                        level={4}
                                        icon="Star"
                                        iconColor={theme.colors.status.warning}
                                        color={theme.colors.status.warning}
                                        subheading="Warning color with icon">
                                        Warning Color
                                    </Heading>
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Form Components Section */}
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

                {/* Status Badges Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Status Badges</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.md }}>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Solid Variant (Default):
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" />
                                    <StatusBadge status="error" text="Error" />
                                    <StatusBadge status="warning" text="Warning" />
                                    <StatusBadge status="info" text="Info" />
                                    <StatusBadge status="primary" text="Primary" />
                                    <StatusBadge status="secondary" text="Secondary" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Soft Variant:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" variant="soft" />
                                    <StatusBadge status="error" text="Error" variant="soft" />
                                    <StatusBadge status="warning" text="Warning" variant="soft" />
                                    <StatusBadge status="info" text="Info" variant="soft" />
                                    <StatusBadge status="purple" text="Purple" variant="soft" />
                                    <StatusBadge status="orange" text="Orange" variant="soft" />
                                    <StatusBadge status="teal" text="Teal" variant="soft" />
                                    <StatusBadge status="pink" text="Pink" variant="soft" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Outlined Variant:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" variant="outlined" />
                                    <StatusBadge status="error" text="Error" variant="outlined" />
                                    <StatusBadge status="warning" text="Warning" variant="outlined" />
                                    <StatusBadge status="info" text="Info" variant="outlined" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    With Icons:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap' }}>
                                    <StatusBadge status="success" text="Success" icon="CheckCircle" variant="soft" />
                                    <StatusBadge status="error" text="Error" icon="XCircle" variant="soft" />
                                    <StatusBadge status="warning" text="Warning" icon="AlertTriangle" variant="soft" />
                                    <StatusBadge status="info" text="Info" icon="Info" variant="soft" />
                                </View>
                            </View>
                            <View>
                                <BodyText style={{ marginBottom: theme.spacing.sm, fontWeight: '600' }}>
                                    Sizes:
                                </BodyText>
                                <View style={{ flexDirection: 'row', gap: theme.spacing.md, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <StatusBadge status="success" text="Extra Small" size="extraSmall" variant="soft" />
                                    <StatusBadge status="success" text="Small" size="small" variant="soft" />
                                    <StatusBadge status="success" text="Medium" size="medium" variant="soft" />
                                    <StatusBadge status="success" text="Large" size="large" variant="soft" />
                                </View>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* Tabs Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Tabs</Heading5>
                    <Card>
                        <Tabs
                            tabs={tabs}
                            selectedIndex={selectedTab}
                            onTabPress={setSelectedTab}
                            variant="pill-outlined"
                        />
                        <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.md }}>
                            <BodyText>Selected Tab: {tabs[selectedTab]?.label}</BodyText>
                        </View>
                    </Card>
                </View>

                {/* Accordion Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Accordion (deprecated)</Heading5>
                    <Card>
                        <AccordionGroup allowMultiple={false} gap={theme.spacing.sm}>
                            <Accordion
                                title="Accordion Item 1"
                                contentStyle={{ padding: theme.spacing.md }}>
                                <BodyText>
                                    This is the content of the first accordion item. You can put any content here.
                                </BodyText>
                            </Accordion>
                            <Accordion
                                title="Accordion Item 2"
                                contentStyle={{ padding: theme.spacing.md }}>
                                <BodyText>
                                    This is the content of the second accordion item.
                                </BodyText>
                            </Accordion>
                            <Accordion
                                title="Accordion Item 3"
                                contentStyle={{ padding: theme.spacing.md }}>
                                <BodyText>
                                    This is the content of the third accordion item.
                                </BodyText>
                            </Accordion>
                        </AccordionGroup>
                    </Card>
                </View>

                {/* Label Value Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Label Value (Deprecated)</Heading5>
                    <Card>
                        <View style={{ gap: theme.spacing.sm }}>
                            <LabelValue label="Name:" value="John Doe" />
                            <LabelValue label="Email:" value="john.doe@example.com" />
                            <LabelValue label="Status:" value="Active" alignment="right" />
                            <LabelValue
                                label="Balance:"
                                value="$1,234.56"
                                alignment="right"
                                valueStyle={{ color: theme.colors.status.success }}
                            />
                        </View>
                    </Card>
                </View>

                {/* Cards Section */}
                <Separator />
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>Cards (Deprecated)</Heading5>
                    <View style={{ gap: theme.spacing.md }}>
                        <Card>
                            <BodyText>Basic Card with content</BodyText>
                        </Card>
                        <Card style={{ backgroundColor: theme.colors.primaryLight }}>
                            <BodyText>Card with custom background</BodyText>
                        </Card>
                    </View>
                </View>
                <Separator />

                {/* CardWithHeader & DetailGridRenderer Section */}
                <View>
                    <Heading5 style={{ marginBottom: theme.spacing.md }}>
                        CardWithHeader & DetailGridRenderer
                    </Heading5>

                    <YStack gap={theme.spacing.md}>

                        <CardWithHeader
                            badges={[
                                { label: '1', backgroundColor: theme.colors.primary },
                                { label: 'Slab', backgroundColor: theme.colors.status.info },
                            ]}
                            title={
                                <View>
                                    <Heading6>PROD-001-12345</Heading6>
                                    <Caption>Bin: A-01 | Warehouse: Main Location</Caption>
                                </View>
                            }
                            actions={[
                                {
                                    label: 'View Details',
                                    icon: Info,
                                    onPress: () => {
                                        console.log('View details');
                                    },
                                },
                                {
                                    label: 'Edit',
                                    icon: Edit3,
                                    onPress: () => {
                                        console.log('Edit');
                                    },
                                },
                                {
                                    label: 'Share',
                                    icon: Share2,
                                    onPress: () => {
                                        console.log('Share');
                                    },
                                },
                                {
                                    label: 'Duplicate',
                                    icon: Copy,
                                    onPress: () => {
                                        console.log('Duplicate');
                                    },
                                },
                                {
                                    label: 'Delete',
                                    icon: Trash2,
                                    iconColor: theme.colors.status.error,
                                    destructive: true,
                                    onPress: () => {
                                        console.log('Delete');
                                    },
                                },
                            ]}
                            headerBorder={true}>
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'BL-BN-SN',
                                        value: 'BLK-001-BND-002-SN-003',
                                        width: '30%',
                                    },
                                    {
                                        label: 'Barcode',
                                        value: '1234567890',
                                        icon: <Icon name="QrCode" size={14} color="#06B6D4" />,
                                        valueStyle: { color: '#111827' },
                                        width: '30%',
                                    },
                                    {
                                        label: 'On Hand',
                                        value: '125.50 sqft',
                                        valueStyle: {
                                            color: '#06B6D4',
                                            fontWeight: '600',
                                        },
                                        width: '30%',
                                    },
                                ]}
                                justifyContent="space-between"
                                gap={theme.spacing.md}
                                containerProps={{
                                    marginBottom: theme.spacing.lg,
                                    paddingBottom: theme.spacing.lg,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6',
                                }}
                            />
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'Landed Cost',
                                        value: 1250.75,
                                        type: 'money',
                                        valueStyle: { fontSize: theme.typography.fontSize.base },
                                        width: '30%',
                                    },
                                    {
                                        label: 'Selling Cost',
                                        value: 1899.99,
                                        type: 'money',
                                        valueStyle: { fontSize: theme.typography.fontSize.base },
                                        width: '30%',
                                    },
                                    {
                                        label: 'Status',
                                        value: (
                                            <StatusBadge
                                                status="success"
                                                text="In Inventory"
                                                icon="Package"
                                                variant="soft"
                                                size="small"
                                            />
                                        ),
                                        width: '30%',
                                    },
                                ]}
                                gap={theme.spacing.md}
                            />
                        </CardWithHeader>

                        {/* Another example with different status */}
                        <CardWithHeader
                            badges={[
                                { label: '2', backgroundColor: theme.colors.secondary },
                                { label: 'Generic', backgroundColor: theme.colors.status.warning },
                            ]}
                            title="PROD-002-67890"
                            actions={[
                                {
                                    label: 'View',
                                    icon: Info,
                                    onPress: () => console.log('View'),
                                },
                                {
                                    label: 'Edit',
                                    icon: Edit3,
                                    onPress: () => console.log('Edit'),
                                },
                            ]}>
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'Product Type',
                                        value: 'Generic Product',
                                        width: '50%',
                                    },
                                    {
                                        label: 'Barcode',
                                        value: '9876543210',
                                        icon: <Icon name="QrCode" size={14} color="#06B6D4" />,
                                        width: '50%',
                                    },
                                    {
                                        label: 'Price',
                                        value: 99.99,
                                        type: 'money',
                                        width: '50%',
                                    },
                                    {
                                        label: 'Status',
                                        value: (
                                            <StatusBadge
                                                status="warning"
                                                text="Allocated"
                                                icon="FileText"
                                                variant="soft"
                                                size="small"
                                            />
                                        ),
                                        width: '50%',
                                    },
                                ]}
                                gap={theme.spacing.md}
                            />
                        </CardWithHeader>

                    </YStack>

                </View>
            </Container>
        </BaseScreen>
    );
};

export default ComponentDemoScreen;

