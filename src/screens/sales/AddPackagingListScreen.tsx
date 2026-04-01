import { useFocusEffect } from '@react-navigation/native';
import { Mail, Phone, User } from '@tamagui/lucide-icons';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import FinancialSummary from '../../components/sales/FinancialSummary';
import ProductsTableForPL from '../../components/sales/ProductsTableForPL';
import { BodyText, Button, Heading, Heading5 } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DatePicker from '../../components/ui/DatePicker';
import FormFieldWrapper from '../../components/ui/FormFieldWrapper';
import FormTextArea from '../../components/ui/FormTextArea';
import FormTextInput from '../../components/ui/FormTextInput';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator';
import SelectDropdown from '../../components/ui/SelectDropdown';
import { services } from '../../network';
import { ScreenProps } from '../../types/NavigationTypes';
import { showErrorToast, showSuccessToast } from '../../utils';

export interface LoadingOrderForPLData {
    id: number;
    code: string;
    clientLoNumber: number;
    loDate: string;
    expDeliveryDate: string;
    paymentTermId: number | null;
    deliveryNotes: string;
    deliveryType: string;
    shippingAddressId: number;
    salesOrder: {
        tax: {
            id: number;
            code: string;
            label: string;
            value: number;
            stateTax: number;
        };
        id: number;
        customer: {
            id: number;
            name: string;
            contactName: string;
            primaryPhoneNumber: string;
            email: string;
        };
        soLocation: {
            id: number;
            location: string;
        };
    };
    shippingAddress: {
        id: number;
        address: string;
        contactName: string;
        contactEmail: string;
        contactNumber: string;
    };
    products: Array<{
        id: number;
        name: string;
        unitPrice: string;
        salesOrderProduct: Array<{
            id: number;
            unitPrice: string;
            taxPercentage: number;
            loSqrFt: number;
            loRemeasureLength?: number;
            loRemeasureWidth?: number;
            plRemeasureLength?: number;
            plRemeasureWidth?: number;
            inventoryProduct: {
                id: number;
                combinedNumber: string;
                bin: {
                    id: number;
                    name: string;
                };
                slab: {
                    id: number;
                    serialNumber: number;
                    slabNumber: number;
                    block: string;
                    lot: string;
                    barcode: string;
                    receivingLength: number;
                    receivingWidth: number;
                };
            };
        }>;
        calculations: {
            loadingOrder: {
                subTotal: number;
                tax: number;
                total: number;
            };
        };
        totalQuantity: number;
        totalOrderQuantity: number;
    }>;
}

export type AddPackagingListScreenProps = ScreenProps<{ loadingOrderId: number }>;

interface SelectedProduct {
    salesOrderProductId: number;
    plRemeasureLength?: number;
    plRemeasureWidth?: number;
}

const AddPackagingListScreen: React.FC<AddPackagingListScreenProps> = props => {
    const loadingOrderId = props.route.params?.loadingOrderId;
    const [data, setData] = useState<LoadingOrderForPLData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Form state
    const [plDate, setPlDate] = useState<Date>(new Date());
    const [paymentTermId, setPaymentTermId] = useState<number | null>(null);
    const [deliveryNotes, setDeliveryNotes] = useState<string>('');
    const [internalNote, setInternalNote] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<Map<number, SelectedProduct>>(new Map());

    const tokens = getTokens();
    const theme = useTheme();

    useFocusEffect(
        useCallback(() => {
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

                // Set initial form values
                setPlDate(new Date());
                setPaymentTermId(apiData.salesOrder?.paymentTermId || null);
                setDeliveryNotes(apiData.deliveryNotes || '');
                setInternalNote('');

                // Initialize all products from loading order with their LO remeasure values
                const initialProducts = new Map<number, SelectedProduct>();
                if (apiData.products) {
                    apiData.products.forEach((product: any) => {
                        product.salesOrderProduct?.forEach((sop: any) => {
                            initialProducts.set(sop.id, {
                                salesOrderProductId: sop.id,
                                plRemeasureLength: sop.plRemeasureLength ?? sop.loRemeasureLength,
                                plRemeasureWidth: sop.plRemeasureWidth ?? sop.loRemeasureWidth,
                            });
                        });
                    });
                }
                setSelectedProducts(initialProducts);
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch loading order data');
            }
        } catch (error) {
            showErrorToast('Failed to fetch loading order data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelectionChange = (salesOrderProductId: number, selected: boolean, remeasureLength?: number, remeasureWidth?: number) => {
        setSelectedProducts(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(salesOrderProductId);
            if (selected) {
                newMap.set(salesOrderProductId, {
                    salesOrderProductId,
                    plRemeasureLength: existing?.plRemeasureLength ?? remeasureLength,
                    plRemeasureWidth: existing?.plRemeasureWidth ?? remeasureWidth,
                });
            } else {
                newMap.delete(salesOrderProductId);
            }
            return newMap;
        });
    };

    const handleRemeasureChange = (salesOrderProductId: number, length?: number, width?: number) => {
        setSelectedProducts(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(salesOrderProductId);
            newMap.set(salesOrderProductId, {
                salesOrderProductId,
                ...existing,
                plRemeasureLength: length,
                plRemeasureWidth: width,
            });
            return newMap;
        });
    };


    const calculateTotals = () => {
        if (!data) return { subtotal: 0, serviceCharges: 0, taxable: 0, tax: 0, total: 0 };

        let subtotal = 0;
        let taxable = 0;

        selectedProducts.forEach((selected, salesOrderProductId) => {
            // Find the product and salesOrderProduct
            let unitPrice = 0;
            let taxPercentage = 0;
            let sqFt = 0;

            data.products.forEach(product => {
                const sop = product.salesOrderProduct.find(p => p.id === salesOrderProductId);
                if (sop) {
                    unitPrice = parseFloat(sop.unitPrice || '0');
                    taxPercentage = sop.taxPercentage || 0;

                    // Calculate sqft from plRemeasure if available, otherwise use loRemeasure, otherwise loSqrFt
                    if (selected.plRemeasureLength && selected.plRemeasureWidth) {
                        sqFt = (selected.plRemeasureLength * selected.plRemeasureWidth) / 144; // Convert to square feet
                    } else if (sop.loRemeasureLength && sop.loRemeasureWidth) {
                        sqFt = (sop.loRemeasureLength * sop.loRemeasureWidth) / 144;
                    } else {
                        sqFt = sop.loSqrFt || 0;
                    }
                }
            });

            const productTotal = unitPrice * sqFt;
            subtotal += productTotal;
            taxable += productTotal;
        });

        const tax = taxable * (data.salesOrder.tax.value / 100);
        const total = subtotal + tax;

        return { subtotal, serviceCharges: 0, taxable, tax, total };
    };

    const handleSubmit = async () => {
        if (!data) {
            showErrorToast('Loading order data is missing');
            return;
        }

        if (selectedProducts.size === 0) {
            showErrorToast('No products available');
            return;
        }

        setSubmitting(true);
        try {
            const soProducts = Array.from(selectedProducts.values()).map(selected => ({
                id: selected.salesOrderProductId.toString(),
                plRemeasureLength: selected.plRemeasureLength,
                plRemeasureWidth: selected.plRemeasureWidth,
            }));

            const payload = {
                plDate: moment(plDate).format('YYYY-MM-DD'),
                loadingOrderId: loadingOrderId.toString(),
                soProducts: soProducts,
            };

            const response = await services.sales.createPackagingList(payload);
            if (response.success) {
                showSuccessToast('Packaging List created successfully');
                props.navigation.goBack();
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to create packaging list');
            }
        } catch (error) {
            showErrorToast('Failed to create packaging list');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !data) {
        return (
            <BaseScreen>
                <ScreenLoadingIndicator title="Loading Loading Order Data..." />
            </BaseScreen>
        );
    }

    const totals = calculateTotals();
    // PL number will be generated by the backend, just show a placeholder
    const plNumber = '1'; // This will be generated by backend
    const loNumber = data.code || `LO ${data.clientLoNumber}`;

    return (
        <BaseScreen scrollable={false} keyboardAware={false} backgroundColor={theme.backgroundSecondary?.val}>
            <ScrollView
                contentContainerStyle={{
                    padding: tokens.space[5].val,
                    paddingBottom: tokens.space[8].val,
                }}>
                {/* Header */}
                <YStack marginBottom={tokens.space[4].val}>
                    <Heading level={3} color={theme.textPrimary?.val || '#1F2937'}>
                        New Packaging List
                    </Heading>
                    <BodyText color={theme.textSecondary?.val || '#6B7280'} style={{ marginTop: tokens.space[1].val }}>
                        {`PL #${plNumber} of ${loNumber}`}
                    </BodyText>
                </YStack>

                {/* Main Content: Two Column Layout */}
                <XStack gap={tokens.space[4].val} alignItems="flex-start" flexWrap="wrap">
                    {/* Left Column: Packaging List Details */}
                    <YStack flex={1} minWidth={300} gap={tokens.space[4].val}>
                        {/* Packaging List Details Card */}
                        <CardWithHeader title="Packaging List Details">
                            <YStack gap={tokens.space[4].val}>
                                {/* Bill To Field */}
                                <FormFieldWrapper label="Bill To">
                                    <FormTextInput value={data.salesOrder.customer.name} onChange={() => { }} disabled />
                                </FormFieldWrapper>

                                {/* Contact Information Card */}
                                <CardWithHeader
                                    title="CONTACT INFORMATION"
                                    variant="highlighted"
                                    color="blue"
                                    containerProps={{ padding: tokens.space[4].val }}>
                                    <YStack gap={tokens.space[2].val}>
                                        <Heading5 color={theme.textPrimary?.val || '#1F2937'}>
                                            {data.salesOrder.customer.contactName}
                                        </Heading5>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.salesOrder.customer.primaryPhoneNumber}
                                            </BodyText>
                                        </XStack>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.salesOrder.customer.email}
                                            </BodyText>
                                        </XStack>
                                    </YStack>
                                </CardWithHeader>

                                {/* Delivery Location Field */}
                                <FormFieldWrapper label="Delivery Location">
                                    <FormTextInput value={data.shippingAddress.address} onChange={() => { }} disabled />
                                </FormFieldWrapper>

                                {/* Shipping Address Card */}
                                <CardWithHeader
                                    title="SHIPPING ADDRESS"
                                    variant="highlighted"
                                    color="green"
                                    containerProps={{ padding: tokens.space[4].val }}>
                                    <YStack gap={tokens.space[2].val}>
                                        <Heading5 color={theme.green9?.val || '#15803D'}>
                                            {data.shippingAddress.address}
                                        </Heading5>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <User size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.shippingAddress.contactName}
                                            </BodyText>
                                        </XStack>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.shippingAddress.contactNumber}
                                            </BodyText>
                                        </XStack>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.shippingAddress.contactEmail}
                                            </BodyText>
                                        </XStack>
                                    </YStack>
                                </CardWithHeader>
                            </YStack>
                        </CardWithHeader>
                    </YStack>

                    {/* Right Column: Notes */}
                    <YStack minWidth={300} width={'100%'} gap={tokens.space[4].val}>
                        <CardWithHeader title="Notes">
                            <YStack gap={tokens.space[4].val}>
                                <FormFieldWrapper label="Internal Notes">
                                    <FormTextArea
                                        value={internalNote}
                                        onChange={(value) => setInternalNote(value || '')}
                                        placeholder="Enter internal notes..."
                                        numberOfLines={6}
                                    />
                                </FormFieldWrapper>
                                <FormFieldWrapper label="Delivery Notes">
                                    <FormTextArea
                                        value={deliveryNotes}
                                        onChange={(value) => setDeliveryNotes(value || '')}
                                        placeholder="Enter delivery notes..."
                                        numberOfLines={6}
                                    />
                                </FormFieldWrapper>
                            </YStack>
                        </CardWithHeader>
                    </YStack>
                </XStack>

                {/* PL Details Section */}
                <CardWithHeader title="PL Details" containerProps={{ marginTop: tokens.space[4].val }}>
                    <XStack gap={tokens.space[4].val} flexWrap="wrap">
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="P.L. Date">
                                <DatePicker
                                    value={plDate}
                                    onChange={(date) => date && setPlDate(date)}
                                />
                            </FormFieldWrapper>
                        </YStack>
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="SO Location">
                                <FormTextInput value={data.salesOrder.soLocation.location} onChange={() => { }} disabled />
                            </FormFieldWrapper>
                        </YStack>
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="Payment Terms">
                                <SelectDropdown
                                    endpoint="paymentTerms"
                                    value={paymentTermId}
                                    onSelectionChange={(value) => setPaymentTermId(value as number)}
                                    placeholder="Select terms"
                                />
                            </FormFieldWrapper>
                        </YStack>
                    </XStack>
                </CardWithHeader>

                {/* Products Section */}
                <YStack marginTop={tokens.space[4].val}>
                    <ProductsTableForPL
                        products={data.products}
                        selectedProducts={selectedProducts}
                        onProductSelectionChange={handleProductSelectionChange}
                        onRemeasureChange={handleRemeasureChange}
                        taxPercentage={data.salesOrder.tax.value}
                        onRefresh={fetchData}
                    />

                </YStack>

                {/* Financial Summary and Actions */}
                <XStack gap={tokens.space[4].val} marginTop={tokens.space[4].val} alignItems="flex-start" flexWrap="wrap">
                    <YStack flex={1} minWidth={200} />
                    <YStack minWidth={300}>
                        <FinancialSummary
                            items={[
                                { label: 'Subtotal', value: totals.subtotal },
                                { label: 'Service Charges', value: totals.serviceCharges },
                                { label: 'Taxable', value: totals.taxable },
                                { label: `Tax(${data.salesOrder.tax.value}%)`, value: totals.tax },
                                { label: 'Total', value: totals.total, bold: true, color: theme.blue8?.val || '#3B82F6', divider: true },
                            ]}
                        />
                        <YStack
                            gap={tokens.space[3].val}
                            backgroundColor={theme.backgroundSecondary?.val || '#F9FAFB'}
                            marginTop={tokens.space[4].val}
                            paddingTop={tokens.space[4].val}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                fullWidth
                                onPress={() => props.navigation.goBack()}
                                disabled={submitting}
                            />
                            <Button
                                title="Create Packaging List"
                                variant="primary"
                                fullWidth
                                onPress={handleSubmit}
                                loading={submitting}
                            />
                        </YStack>
                    </YStack>
                </XStack>
            </ScrollView>
        </BaseScreen>
    );
};

export default AddPackagingListScreen;



