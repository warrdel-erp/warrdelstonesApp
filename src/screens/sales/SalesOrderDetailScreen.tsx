import { useFocusEffect } from '@react-navigation/native';
import { Building2, Info, Mail, MapPin, Phone, User } from '@tamagui/lucide-icons';
import moment from 'moment';
import React from 'react';
import { ScrollView } from 'react-native';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import FinancialSummary from '../../components/sales/FinancialSummary';
import LoadingOrdersTable from '../../components/sales/LoadingOrdersTable';
import NotesSection from '../../components/sales/NotesSection';
import ProductsTable, { InventoryItem, ProductRow } from '../../components/sales/ProductsTable';
import { Badge, Button, Heading } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator';
import { services } from '../../network';
import { ScreenProps } from '../../types/NavigationTypes';
import { showErrorToast } from '../../utils';

export interface SalesOrderDetailResponse {
    success: boolean;
    message: string;
    data: SalesOrderDetail;
}

export interface SalesOrderDetail {
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
    customerPo: string | null;
    status: string;
    deliveryType: string;
    deliveryNotes: string;
    paymentTermId: number | null;
    customerPoDate: string | null;
    expDeliveryDate: string | null;
    accountId: number;
    customerId: number;
    shippingAddressId: number;
    clientId: number;
    soLocationId: number;
    taxId: number;
    createdAt: string;
    updatedAt: string;
    customer: {
        id: number;
        name: string;
        contactName: string;
        primaryPhoneNumber: string;
        email: string;
        salesTax?: {
            id: number;
            code: string;
            label: string;
            value: number;
            stateTax: number;
        };
        paymentTerm?: {
            id: number;
            value: string;
        };
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
        contactName: string;
        contactNumber: string;
        contactMail: string;
        address: string;
    };
    notes: Array<{
        id: number;
        note: string;
        type: 'PRINTED' | 'INTERNAL';
    }>;
    calculations: {
        final: {
            subTotal: number;
            taxable: number;
            tax: number;
            total: number;
        };
    };
    totalAdvancedDeposit: number;
    loadingOrders: Array<{
        id: number;
        code: string;
        date?: string;
        createdAt?: string;
        stage?: string;
        finalTotal?: number;
        totalProfit?: number;
        status?: number;
        packagingList?: {
            id: number;
            code: string;
        } | null;
        invoice?: {
            id: number;
            code: string;
        } | null;
    }>;
    products: Array<{
        id: number;
        name: string;
        salesOrderProduct: Array<{
            id: number;
            unitPrice: string;
            taxApplied: number;
            taxPercentage: number;
            receivingAreaSqFt: number;
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
    }>;
}

export type SalesOrderDetailScreenProps = ScreenProps<{ salesOrderId: number }>;

const SalesOrderDetailScreen: React.FC<SalesOrderDetailScreenProps> = props => {
    const salesOrderId = props.route.params?.salesOrderId;
    const [salesOrderDetail, setSalesOrderDetail] = React.useState<SalesOrderDetail | null>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const tokens = getTokens();
    const theme = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            if (salesOrderId) {
                getSalesOrderDetail();
            }
            return () => { };
        }, [salesOrderId]),
    );

    const getSalesOrderDetail = async () => {
        setLoading(true);
        try {
            const response = await services.sales.salesOrder(salesOrderId);
            if (response.success && response.data) {
                setSalesOrderDetail(response.data.data as any);
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch sales order details');
            }
        } catch (error) {
            showErrorToast('Failed to fetch sales order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !salesOrderDetail) {
        return (
            <BaseScreen>
                <ScreenLoadingIndicator title="Loading Sales Order Details..." />
            </BaseScreen>
        );
    }

    // Extract notes
    const printedNotes = salesOrderDetail.notes
        ?.filter(n => n?.type === 'PRINTED')
        ?.map(n => n?.note)
        ?.join('\n');
    const internalNotes = salesOrderDetail.notes
        ?.filter(n => n?.type === 'INTERNAL')
        ?.map(n => n?.note)
        ?.join('\n');

    // Transform products data
    const products: ProductRow[] = salesOrderDetail.products?.map(product => {
        const firstProduct = product.salesOrderProduct[0];
        const totalQty = product.salesOrderProduct.reduce(
            (sum, p) => sum + p.receivingAreaSqFt,
            0,
        );
        const unitPrice = parseFloat(firstProduct?.unitPrice || '0');
        const total = totalQty * unitPrice;

        const inventoryItems: InventoryItem[] = product.salesOrderProduct?.map(sop => ({
            serialNo: sop.inventoryProduct.combinedNumber,
            barcode: sop.inventoryProduct.slab.barcode,
            blockBundle: `${sop.inventoryProduct.slab.block}-${sop.inventoryProduct.slab.lot}`,
            slabNo: sop.inventoryProduct.slab.slabNumber.toString(),
            location: sop.inventoryProduct.bin.name,
            qtySf: `${sop.inventoryProduct.slab.receivingLength}*${sop.inventoryProduct.slab.receivingWidth}=${sop.receivingAreaSqFt.toFixed(2)}SF`,
            subTrx: '-',
            productId: product.id,
        }));

        return {
            id: product.id,
            productName: product.name,
            description: '-',
            units: 'SF',
            qty: totalQty,
            pricePerUnit: unitPrice,
            total: total,
            tax: firstProduct?.taxApplied === 1,
            inventoryItems,
        };
    });

    const deliveryTypeUpper = salesOrderDetail.deliveryType?.toUpperCase() || '';

    const calculations = salesOrderDetail.calculations?.final;
    const due = calculations?.total - salesOrderDetail.totalAdvancedDeposit;

    return (
        <BaseScreen scrollable={true} keyboardAware={false} backgroundColor={theme.backgroundSecondary?.val}>
            <ScrollView
                contentContainerStyle={{
                    padding: tokens.space[5].val,
                    paddingBottom: tokens.space[8].val,
                }}>
                {/* Sales Order Details Section */}
                <YStack gap={tokens.space[1].val}>
                    <XStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                        marginBottom={tokens.space[3].val}>
                        <Heading
                            level={3}
                            subheading="Sales Order"
                            color={theme.textPrimary?.val || '#1F2937'}>
                            {`SO-${salesOrderDetail.clientSoNumber}`}
                        </Heading>
                        {deliveryTypeUpper && (
                            <Badge
                                label={deliveryTypeUpper}
                            />
                        )}
                    </XStack>

                    {/* Customer, Shipping, SO Location Cards */}
                    <XStack gap={tokens.space[1].val} flexWrap="wrap">
                        <CardWithHeader
                            title="CUSTOMER"
                            variant="highlighted"
                            color="blue"
                            containerProps={{ flex: 1, minWidth: 200 }}

                        >
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'Name',
                                        value: salesOrderDetail?.customer?.contactName || '-',
                                        icon: <User size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Phone',
                                        value: salesOrderDetail?.customer?.primaryPhoneNumber || '-',
                                        icon: <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Email',
                                        value: salesOrderDetail?.customer?.email || '-',
                                        icon: <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                ]}
                            />
                        </CardWithHeader>

                        <CardWithHeader
                            title="SHIPPING ADDRESS"
                            variant="highlighted"
                            color="green"
                            containerProps={{ flex: 1, minWidth: 200 }}
                        >
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'Address',
                                        value: salesOrderDetail?.shippingAddress?.address || '-',
                                        icon: <MapPin size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                        width: '100%',
                                        wrapText: true,
                                    },
                                    {
                                        label: 'Name',
                                        value: salesOrderDetail?.shippingAddress?.contactName || '-',
                                        icon: <User size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Phone',
                                        value: salesOrderDetail?.shippingAddress?.contactNumber || '-',
                                        icon: <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Email',
                                        value: salesOrderDetail?.shippingAddress?.contactEmail || '-',
                                        icon: <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                ]}
                            />
                        </CardWithHeader>

                        <CardWithHeader
                            title="SO LOCATION"
                            variant="highlighted"
                            color="yellow"
                            containerProps={{ flex: 1, minWidth: 200 }}
                        >
                            <DetailGridRenderer
                                items={[
                                    {
                                        label: 'Location',
                                        value: salesOrderDetail?.soLocation?.location || '-',
                                        icon: <Building2 size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                        width: '100%',
                                        wrapText: true,
                                    },
                                    {
                                        label: 'Address',
                                        value: salesOrderDetail?.soLocation?.address || '-',
                                        icon: <MapPin size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                        width: '100%',
                                        wrapText: true,
                                    },
                                    {
                                        label: 'Name',
                                        value: salesOrderDetail?.soLocation?.contactName || '-',
                                        icon: <User size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Phone',
                                        value: salesOrderDetail?.soLocation?.contactNumber || '-',
                                        icon: <Phone size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                    {
                                        label: 'Email',
                                        value: salesOrderDetail?.soLocation?.contactMail || '-',
                                        icon: <Mail size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                                    },
                                ]}
                            />
                        </CardWithHeader>
                    </XStack>

                    {/* Notes Section */}
                    <NotesSection printedNotes={printedNotes} internalNotes={internalNotes} />

                    {/* Order Information */}
                    <CardWithHeader title="Order Information">
                        <DetailGridRenderer
                            items={[
                                {
                                    label: 'SO Date',
                                    value: moment(salesOrderDetail.soDate).format('MMM DD, YYYY'),
                                    width: '47%',
                                },
                                {
                                    label: 'Customer PO',
                                    value: salesOrderDetail.customerPo || '-',
                                    width: '47%',
                                },
                                {
                                    label: 'Customer PO Date',
                                    value: salesOrderDetail.customerPoDate
                                        ? moment(salesOrderDetail.customerPoDate).format('MMM DD, YYYY')
                                        : '-',
                                    width: '47%',
                                },
                                {
                                    label: 'Expected Delivery',
                                    value: salesOrderDetail.expDeliveryDate
                                        ? moment(salesOrderDetail.expDeliveryDate).format('MMM DD, YYYY')
                                        : '-',
                                    width: '47%',
                                },
                                {
                                    label: 'Payment Terms',
                                    value: salesOrderDetail?.customer?.paymentTerm
                                        ? `${salesOrderDetail?.customer?.paymentTerm?.value} Days`
                                        : '- Days',
                                    width: '47%',
                                },
                            ]}
                        />
                    </CardWithHeader>
                </YStack>

                {/* Loading Orders Section */}
                <YStack gap={tokens.space[1].val} marginBottom={tokens.space[4].val}>
                    <LoadingOrdersTable
                        loadingOrders={(salesOrderDetail.loadingOrders || []).map((lo: any) => ({
                            id: lo.id,
                            code: lo.code,
                            date: lo.date || lo.createdAt,
                            stage: lo.stage,
                            finalTotal: lo.finalTotal || lo.calculations?.final?.total || 0,
                            totalProfit: lo.totalProfit || lo.calculations?.final?.profit || 0,
                            status: lo.status || lo.fulFilled || 0,
                            packagingList: lo.packagingList || null,
                            invoice: lo.invoice || null,
                        }))}
                    />
                </YStack>

                {/* Products Section */}
                <YStack gap={tokens.space[1].val} marginBottom={tokens.space[4].val}>
                    <ProductsTable products={products} />
                </YStack>

                {/* Financial Summary */}
                <YStack gap={tokens.space[1].val}>
                    <FinancialSummary
                        title="Financial Summary"
                        items={[
                            {
                                label: 'Sub-Total',
                                value: calculations?.subTotal || 0,
                            },
                            {
                                label: 'Taxable',
                                value: calculations?.taxable || 0,
                            },
                            {
                                label: `Tax(${salesOrderDetail.tax?.value || 0}%)`,
                                value: calculations?.tax || 0,
                            },
                            {
                                label: 'Total',
                                value: calculations?.total || 0,
                                bold: true,
                                color: theme.blue8?.val || '#3B82F6',
                                divider: true,
                            },
                            {
                                label: 'Due',
                                value: due || 0,
                                bold: true,
                                color: theme.blue8?.val || '#3B82F6',
                            },
                            {
                                label: 'Advanced Deposit',
                                value: salesOrderDetail.totalAdvancedDeposit || 0,
                                icon: <Info size={16} color={theme.textSecondary?.val || '#6B7280'} />,
                            },
                        ]}
                    />
                    {/* Action Buttons */}
                    <YStack
                        gap={tokens.space[3].val}
                        backgroundColor={theme.backgroundSecondary?.val || '#F9FAFB'}>
                        <Button
                            title="Add Advance Deposit"
                            variant="primary"
                            fullWidth
                            onPress={() => {
                                // TODO: Implement add advance deposit
                            }}
                        />
                        <Button
                            title="Receive Payment"
                            variant="primary"
                            fullWidth
                            onPress={() => {
                                // TODO: Implement receive payment
                            }}
                        />
                        <Button
                            title="Back to List"
                            variant="outline"
                            fullWidth
                            onPress={() => props.navigation.goBack()}
                        />
                    </YStack>
                </YStack>
            </ScrollView>
        </BaseScreen>
    );
};

export default SalesOrderDetailScreen;

