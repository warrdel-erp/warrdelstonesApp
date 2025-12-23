import { Copy, Edit3, Info, Share2, Trash2 } from '@tamagui/lucide-icons';
import React from 'react';
import { View } from 'react-native';
import { YStack } from 'tamagui';
import { Caption, Container, Heading5, Heading6, Icon, StatusBadge } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import theme from '../../theme';

const CardWithHeaderDemoScreen: React.FC = () => {
    return (
        <BaseScreen scrollable={true} keyboardAware={true}>
            <Container style={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
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

export default CardWithHeaderDemoScreen;

