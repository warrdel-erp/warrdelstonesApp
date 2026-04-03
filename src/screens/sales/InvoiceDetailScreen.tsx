import { useFocusEffect } from '@react-navigation/native';
import { Mail, MapPin, Phone } from '@tamagui/lucide-icons';
import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import FinancialSummary from '../../components/sales/FinancialSummary';
import ProductsTableForLODetail from '../../components/sales/ProductsTableForLODetail';
import { BodyText, Button, Heading } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import FormFieldWrapper from '../../components/ui/FormFieldWrapper';
import FormTextArea from '../../components/ui/FormTextArea';
import FormTextInput from '../../components/ui/FormTextInput';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator';
import { services } from '../../network';
import { ScreenProps } from '../../types/NavigationTypes';
import { showErrorToast } from '../../utils';
import { LoadingOrderDetailData } from './LoadingOrderDetailScreen';

export type InvoiceDetailScreenProps = ScreenProps<{ loadingOrderId: number }>;

const InvoiceDetailScreen: React.FC<InvoiceDetailScreenProps> = props => {
    const loadingOrderId = props.route.params?.loadingOrderId;
    const [data, setData] = React.useState<LoadingOrderDetailData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const tokens = getTokens();
    const theme = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            if (loadingOrderId) {
                fetchData();
            }
            return () => { };
        }, [loadingOrderId]),
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await services.sales.loadingOrder(loadingOrderId);
            if (response.success && response.data?.data) {
                const apiData = response.data.data as any;
                setData(apiData);
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch invoice details');
            }
        } catch (error) {
            showErrorToast('Failed to fetch invoice details');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <BaseScreen>
                <ScreenLoadingIndicator title="Loading Invoice Details..." />
            </BaseScreen>
        );
    }

    const calculations = data.calculations?.loadingOrder || data.calculations?.final;
    const tax = data.salesOrder?.tax;
    const billingAddress = data.salesOrder.customer.addresses?.find(addr => addr.addressType === 'REMIT');
    const salesOrderId = data.salesOrder.id;

    // Prepare data structures outside of JSX
    const scrollViewContentStyle = {
        padding: tokens.space[5].val,
        paddingBottom: tokens.space[8].val,
    };

    const orderInformationItems = [
        {
            label: 'Customer',
            value: data.salesOrder.customer.name,
            valueStyle: { color: theme.blue8?.val || '#3B82F6', fontWeight: '600' },
        },
        {
            label: 'SO Location',
            value: data.salesOrder.soLocation.locationName,
            valueStyle: { color: theme.blue8?.val || '#3B82F6', fontWeight: '600' },
        },
        {
            label: 'Payment Term',
            value: data.salesOrder.customer.paymentTerm
                ? `${data.salesOrder.customer.paymentTerm.value} Days`
                : '-- Days',
        },
    ];

    const billingAddressItems = billingAddress
        ? [
            {
                label: 'BILLING ADDRESS',
                value: billingAddress.address,
                icon: <MapPin size={16} color={theme.blue8?.val || '#3B82F6'} />,
                width: '100%',
                wrapText: true,
            },
            {
                label: 'Phone',
                value: billingAddress.contactNumber,
                icon: <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />,
            },
            {
                label: 'Email',
                value: billingAddress.contactEmail,
                icon: <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />,
            },
        ]
        : [];

    const shippingAddressItems = [
        {
            label: 'SHIPPING ADDRESS',
            value: data.shippingAddress.address,
            icon: <MapPin size={16} color={theme.green8?.val || '#10B981'} />,
            valueStyle: { color: theme.green9?.val || '#15803D', fontWeight: '600' },
            width: '100%',
            wrapText: true,
        },
        {
            label: 'Phone',
            value: data.shippingAddress.contactNumber,
            icon: <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />,
        },
        {
            label: 'Email',
            value: data.shippingAddress.contactEmail,
            icon: <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />,
        },
    ];

    const financialSummaryItems = [
        {
            label: 'Sub-Total',
            value: calculations?.subTotal || 0,
        },
        {
            label: 'Service Charges',
            value: 0,
        },
        {
            label: 'Taxable',
            value: calculations?.taxable || 0,
        },
        {
            label: tax ? `Tax(${tax.value}%)` : 'Tax(0%)',
            value: calculations?.tax || 0,
        },
        {
            label: 'Total',
            value: calculations?.total || 0,
            bold: true,
            color: theme.blue8?.val || '#3B82F6',
            divider: true,
        },
    ];

    const cardContainerProps = { flex: 1, minWidth: 300 };

    return (
        <BaseScreen scrollable={true} keyboardAware={false} backgroundColor={theme.backgroundSecondary?.val}>
            <ScrollView contentContainerStyle={scrollViewContentStyle}>
                {/* Header */}
                <YStack gap={tokens.space[2].val} marginBottom={tokens.space[4].val}>
                    <Heading
                        level={3}
                        color={theme.textPrimary?.val || '#1F2937'}>
                        Invoice Details
                    </Heading>
                    <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                        Invoice for SO #{data.salesOrder.clientSoNumber}
                    </BodyText>
                </YStack>

                {/* Main Content: Two Column Layout */}
                <XStack gap={tokens.space[4].val} alignItems="flex-start" flexWrap="wrap" marginBottom={tokens.space[4].val}>
                    {/* Left Column: Order Information */}
                    <YStack flex={1} minWidth={300} gap={tokens.space[4].val}>
                        <CardWithHeader title="Order Information">
                            <DetailGridRenderer items={orderInformationItems} gap={tokens.space[3].val} />
                        </CardWithHeader>
                    </YStack>

                    {/* Right Column: Addresses */}
                    <YStack flex={1} minWidth={300} gap={tokens.space[4].val}>
                        <CardWithHeader title="Addresses">
                            <XStack gap={tokens.space[4].val} flexWrap="wrap">
                                {/* Billing Address */}
                                {billingAddress && (
                                    <YStack flex={1} minWidth={250}>
                                        <CardWithHeader
                                            title=""
                                            variant="highlighted"
                                            color="blue"
                                            containerProps={{ padding: tokens.space[4].val }}>
                                            <DetailGridRenderer items={billingAddressItems} gap={tokens.space[2].val} />
                                        </CardWithHeader>
                                    </YStack>
                                )}

                                {/* Shipping Address */}
                                <YStack flex={1} minWidth={250}>
                                    <CardWithHeader
                                        title=""
                                        variant="highlighted"
                                        color="green"
                                        containerProps={{ padding: tokens.space[4].val }}>
                                        <DetailGridRenderer items={shippingAddressItems} gap={tokens.space[2].val} />
                                    </CardWithHeader>
                                </YStack>
                            </XStack>
                        </CardWithHeader>

                        {/* Notes and Delivery Instructions */}
                        <YStack gap={tokens.space[4].val}>
                            <FormFieldWrapper label="Notes:">
                                <FormTextInput
                                    value="--"
                                    onChange={() => { }}
                                    disabled
                                />
                            </FormFieldWrapper>
                            <FormFieldWrapper label="Delivery Instructions:">
                                <FormTextArea
                                    value={data.deliveryNotes || '--'}
                                    onChange={() => { }}
                                    disabled
                                    numberOfLines={3}
                                />
                            </FormFieldWrapper>
                        </YStack>
                    </YStack>
                </XStack>

                {/* Products Section */}
                <YStack marginBottom={tokens.space[4].val}>
                    <ProductsTableForLODetail
                        products={data.products}
                        taxLabel={tax ? `${tax.label}(${tax.value}%)` : '--'}
                    />
                </YStack>

                {/* Financial Summary and Actions */}
                <XStack gap={tokens.space[4].val} alignItems="flex-start" flexWrap="wrap">
                    <YStack flex={1} minWidth={200} />
                    <YStack minWidth={300}>
                        <FinancialSummary
                            title="Financial Summary"
                            items={financialSummaryItems}
                        />
                        <YStack
                            gap={tokens.space[3].val}
                            backgroundColor={theme.backgroundSecondary?.val || '#F9FAFB'}
                            marginTop={tokens.space[4].val}
                            paddingTop={tokens.space[4].val}>
                            <Button
                                title="Back to Sales Order"
                                variant="outline"
                                fullWidth
                                onPress={() => {
                                    props.navigation.navigate('SalesOrderDetail', { salesOrderId });
                                }}
                            />
                        </YStack>
                    </YStack>
                </XStack>
            </ScrollView>
        </BaseScreen>
    );
};

export default InvoiceDetailScreen;
