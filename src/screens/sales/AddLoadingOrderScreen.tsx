import { useFocusEffect } from '@react-navigation/native';
import { Mail, Phone, User } from '@tamagui/lucide-icons';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import FinancialSummary from '../../components/sales/FinancialSummary';
import ProductsTableForLO from '../../components/sales/ProductsTableForLO';
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

export interface SalesOrderForLOData {
    tax: {
        id: number;
        code: string;
        label: string;
        value: number;
        stateTax: number;
    };
    id: number;
    clientSoNumber: number;
    soDate: string;
    customerPo: string;
    status: string;
    deliveryType: string;
    deliveryNotes: string;
    paymentTermId: number | null;
    customerPoDate: string;
    expDeliveryDate: string;
    accountId: number;
    customerId: number;
    shippingAddressId: number;
    clientId: number;
    soLocationId: number;
    taxId: number;
    customer: {
        id: number;
        name: string;
        contactName: string;
        printName: string;
        primaryPhoneNumber: string;
        email: string;
        accEmail: string;
        paymentTerm?: {
            id: number;
            value: string;
        };
        addresses: Array<{
            id: number;
            address: string;
            contactName: string;
            contactEmail: string;
            contactNumber: string;
            addressType: string;
        }>;
    };
    shippingAddress: {
        id: number;
        address: string;
        contactName: string;
        contactEmail: string;
        contactNumber: string;
    };
    soLocation: {
        id: number;
        location: string;
    };
    products: Array<{
        id: number;
        name: string;
        unitPrice: string;
        salesOrderProduct: Array<{
            id: number;
            unitPrice: string;
            taxPercentage: number;
            receivingAreaSqFt: number;
            inventoryProduct: {
                id: number;
                combinedNumber: string;
                bin: {
                    id: number;
                    name: string;
                    warehouse: {
                        location: {
                            id: number;
                            location: string;
                        };
                    };
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
            soReceiving: {
                subTotal: number;
                tax: number;
                total: number;
            };
        };
        totalQuantity: number;
        totalOrderQuantity: number;
    }>;
}

export type AddLoadingOrderScreenProps = ScreenProps<{ salesOrderId: number }>;

interface SelectedProduct {
    salesOrderProductId: number;
    loRemeasureLength?: number;
    loRemeasureWidth?: number;
}

const AddLoadingOrderScreen: React.FC<AddLoadingOrderScreenProps> = props => {
    const salesOrderId = props.route.params?.salesOrderId;
    const [data, setData] = useState<SalesOrderForLOData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Form state
    const [loDate, setLoDate] = useState<Date>(new Date());
    const [expDeliveryDate, setExpDeliveryDate] = useState<Date | undefined>();
    const [deliveryType, setDeliveryType] = useState<string>('delivery');
    const [paymentTermId, setPaymentTermId] = useState<number | null>(null);
    const [deliveryNotes, setDeliveryNotes] = useState<string>('');
    const [internalNote, setInternalNote] = useState<string>('');
    const [selectedProducts, setSelectedProducts] = useState<Map<number, SelectedProduct>>(new Map());

    const tokens = getTokens();
    const theme = useTheme();

    useFocusEffect(
        useCallback(() => {
            if (salesOrderId) {
                fetchData();
            }
            return () => { };
        }, [salesOrderId]),
    );

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await services.sales.getSalesOrderForCreateLO(salesOrderId);
            if (response.success && response.data?.data) {
                const apiData = response.data.data as any;
                setData(apiData);

                // Set initial form values
                setLoDate(new Date());
                setExpDeliveryDate(apiData.expDeliveryDate ? new Date(apiData.expDeliveryDate) : undefined);
                setDeliveryType(apiData.deliveryType || 'delivery');
                setPaymentTermId(apiData.paymentTermId);
                setDeliveryNotes(apiData.deliveryNotes || '');
                setInternalNote('');

                // Initialize with all products selected by default
                const selectionMap = new Map<number, SelectedProduct>();
                apiData.products.forEach((product: any) => {
                    product.salesOrderProduct.forEach((sop: any) => {
                        selectionMap.set(sop.id, {
                            salesOrderProductId: sop.id,
                            loRemeasureLength: sop.inventoryProduct.slab.receivingLength,
                            loRemeasureWidth: sop.inventoryProduct.slab.receivingWidth,
                        });
                    });
                });
                setSelectedProducts(selectionMap);
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch sales order data');
            }
        } catch (error) {
            showErrorToast('Failed to fetch sales order data');
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelectionChange = (salesOrderProductId: number, selected: boolean, remeasureLength?: number, remeasureWidth?: number) => {
        setSelectedProducts(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(salesOrderProductId);
            if (selected) {
                // When selecting, preserve existing dimensions if they exist, otherwise use passed values
                newMap.set(salesOrderProductId, {
                    salesOrderProductId,
                    loRemeasureLength: existing?.loRemeasureLength ?? remeasureLength,
                    loRemeasureWidth: existing?.loRemeasureWidth ?? remeasureWidth,
                });
            } else {
                // When deselecting, keep dimensions but remove from selected products
                // Actually, we'll just delete it - dimensions can be re-entered when selecting again
                newMap.delete(salesOrderProductId);
            }
            return newMap;
        });
    };

    const handleRemeasureChange = (salesOrderProductId: number, length?: number, width?: number) => {
        setSelectedProducts(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(salesOrderProductId);
            // Always create/update entry to store dimensions, even if product is not selected
            // This allows users to edit dimensions before selecting
            newMap.set(salesOrderProductId, {
                salesOrderProductId,
                ...existing,
                loRemeasureLength: length,
                loRemeasureWidth: width,
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

                    // Calculate sqft from remeasure or use receiving area
                    if (selected.loRemeasureLength && selected.loRemeasureWidth) {
                        sqFt = (selected.loRemeasureLength * selected.loRemeasureWidth) / 144; // Convert to square feet
                    } else {
                        sqFt = sop.receivingAreaSqFt || 0;
                    }
                }
            });

            const productTotal = unitPrice * sqFt;
            subtotal += productTotal;
            taxable += productTotal;
        });

        const tax = taxable * (data.tax.value / 100);
        const total = subtotal + tax;

        return { subtotal, serviceCharges: 0, taxable, tax, total };
    };

    const handleSubmit = async () => {
        if (!data || !expDeliveryDate) {
            showErrorToast('Expected Delivery Date is required');
            return;
        }

        if (selectedProducts.size === 0) {
            showErrorToast('Please select at least one product');
            return;
        }

        setSubmitting(true);
        try {
            const soProducts = Array.from(selectedProducts.values()).map(selected => ({
                id: selected.salesOrderProductId.toString(),
                loRemeasureLength: selected.loRemeasureLength,
                loRemeasureWidth: selected.loRemeasureWidth,
            }));

            const payload = {
                loDate: moment(loDate).format('YYYY-MM-DD'),
                expDeliveryDate: moment(expDeliveryDate).format('YYYY-MM-DD'),
                deliveryNotes: deliveryNotes,
                internalNote: internalNote,
                deliveryType: deliveryType,
                shippingAddressId: data.shippingAddressId,
                paymentTermId: paymentTermId,
                customerId: data.customerId,
                salesOrderId: data.id.toString(),
                soProducts: soProducts,
            };

            const response = await services.sales.createLoadingOrder(payload);
            if (response.success) {
                showSuccessToast('Loading Order created successfully');
                props.navigation.goBack();
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to create loading order');
            }
        } catch (error) {
            showErrorToast('Failed to create loading order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !data) {
        return (
            <BaseScreen>
                <ScreenLoadingIndicator title="Loading Sales Order Data..." />
            </BaseScreen>
        );
    }

    const totals = calculateTotals();
    // LO number will be generated by the backend, just show a placeholder
    const loNumber = '7'; // This will be generated by backend

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
                        Add Loading Order
                    </Heading>
                    <BodyText color={theme.textSecondary?.val || '#6B7280'} style={{ marginTop: tokens.space[1].val }}>
                        {`LO #${loNumber}`}
                    </BodyText>
                </YStack>

                {/* Main Content: Two Column Layout */}
                <XStack gap={tokens.space[4].val} alignItems="flex-start" flexWrap="wrap">
                    {/* Left Column: Loading Order Details */}
                    <YStack flex={1} minWidth={300} gap={tokens.space[4].val}>
                        {/* Loading Order Details Card */}
                        <CardWithHeader title="Loading Order Details">
                            <YStack gap={tokens.space[4].val}>
                                {/* Delivery Toggle */}
                                <XStack justifyContent="space-between" alignItems="center">
                                    <BodyText color={theme.textPrimary?.val || '#1F2937'}>Delivery</BodyText>
                                    <Switch
                                        value={deliveryType === 'delivery'}
                                        onValueChange={(value) => setDeliveryType(value ? 'delivery' : 'pickup')}
                                        trackColor={{ false: theme.gray5?.val || '#E5E7EB', true: theme.primary?.val || '#0891B2' }}
                                        thumbColor={theme.background?.val || '#FFFFFF'}
                                    />
                                </XStack>

                                {/* Customer Field */}
                                <FormFieldWrapper label="Customer">
                                    <FormTextInput value={data.customer.name} onChange={() => { }} disabled />
                                </FormFieldWrapper>

                                {/* Contact Information Card */}
                                <CardWithHeader
                                    title="CONTACT INFORMATION"
                                    variant="highlighted"
                                    color="blue"
                                    containerProps={{ padding: tokens.space[4].val }}>
                                    <YStack gap={tokens.space[2].val}>
                                        <Heading5 color={theme.textPrimary?.val || '#1F2937'}>
                                            {data.customer.contactName}
                                        </Heading5>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.customer.primaryPhoneNumber}
                                            </BodyText>
                                        </XStack>
                                        <XStack alignItems="center" gap={tokens.space[2].val}>
                                            <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />
                                            <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                                                {data.customer.email}
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

                {/* LO Details Section */}
                <CardWithHeader title="LO Details" containerProps={{ marginTop: tokens.space[4].val }}>
                    <XStack gap={tokens.space[4].val} flexWrap="wrap">
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="L.O. Date">
                                <DatePicker
                                    value={loDate}
                                    onChange={(date) => date && setLoDate(date)}
                                />
                            </FormFieldWrapper>
                        </YStack>
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="SO Location">
                                <FormTextInput value={data.soLocation.location} onChange={() => { }} disabled />
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
                        <YStack flex={1} minWidth={150}>
                            <FormFieldWrapper label="Exp. Delivery Date" required>
                                <DatePicker
                                    value={expDeliveryDate}
                                    onChange={(date) => setExpDeliveryDate(date)}
                                    placeholder="Select date"
                                />
                            </FormFieldWrapper>
                        </YStack>
                    </XStack>
                </CardWithHeader>

                {/* Products Section */}
                <YStack marginTop={tokens.space[4].val}>
                    <ProductsTableForLO
                        products={data.products}
                        selectedProducts={selectedProducts}
                        onProductSelectionChange={handleProductSelectionChange}
                        onRemeasureChange={handleRemeasureChange}
                        taxPercentage={data.tax.value}
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
                                { label: `Tax(${data.tax.value}%)`, value: totals.tax },
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
                                title="Create Loading Order"
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

export default AddLoadingOrderScreen;
