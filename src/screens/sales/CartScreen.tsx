import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import { z } from 'zod';
import FinancialSummary from '../../components/sales/FinancialSummary';
import { Button, Card, FormRenderer, MobileTable, Spinner } from '../../components/ui';
import CardWithHeader from '../../components/ui/CardWithHeader';
import { FormSectionConfig } from '../../components/ui/FormRenderer';
import { Column } from '../../components/ui/MobileTable';
import { Caption, Heading1 } from '../../components/ui/Typography';
import { ScreenId, StackId } from '../../navigation/navigationConstants';
import { services } from '../../network';
import { useAuthState } from '../../store/hooks';
import { showErrorToast, showSuccessToast } from '../../utils';

const cartSchema = z.object({
    customer: z.number({ message: 'Customer is required' }).min(1, 'Customer is required'),
    deliveryLocation: z.number({ message: 'Delivery Location is required' }).min(1, 'Delivery Location is required'),
    soLocation: z.number({ message: 'SO Location is required' }).min(1, 'SO Location is required'),
});

type CartFormData = z.infer<typeof cartSchema>;

interface Slab {
    id: number;
    combinedNumber: string;
    barcode: string;
    block: string;
    lot: string;
    serialNumber: number;
    receivedSqrFt: number;
    status: string;
}

interface CartItem {
    id: number;
    name: string;
    singleUnitPrice: string;
    inventoryProducts: {
        id: number;
        status: string;
        isSlabType: boolean;
        combinedNumber: string;
        slab: Slab;
        bin?: {
            name: string;
            warehouse: {
                location: {
                    locationName: string;
                }
            }
        }
    }[];
}

const CartScreen: React.FC = () => {
    const tokens = getTokens();
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const auth = useAuthState();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<CartFormData>({
        resolver: zodResolver(cartSchema),
        defaultValues: {
            customer: undefined as any,
            deliveryLocation: undefined as any,
            soLocation: auth.me?.defaultLocationId || (undefined as any),
        },
    });

    const watchedCustomerId = form.watch('customer');

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await services.getApiClient().get('/api/cartItem');
            if (response.data?.success) {
                setCartItems(response.data.data);
            } else {
                showErrorToast(response.data?.message || 'Failed to fetch cart items');
            }
        } catch (error: any) {
            showErrorToast(error?.message || 'Error fetching cart items');
        } finally {
            setLoading(false);
        }
    };

    const formSections: FormSectionConfig[] = [
        {
            id: 'customerLocation',
            title: 'Customer & Location',
            fields: [
                {
                    name: 'customer',
                    type: 'dropdown',
                    label: 'Customer',
                    endpoint: 'customers',
                    required: true,
                    width: '100%',
                },
                {
                    name: 'deliveryLocation',
                    type: 'dropdown',
                    label: 'Delivery Location',
                    endpoint: watchedCustomerId ? `customer/${watchedCustomerId}/addresses` : undefined,
                    queryParams: watchedCustomerId ? { addressType: 'shipping' } : undefined,
                    required: true,
                    selectFirstByDefault: true,
                    width: '100%',
                },
                {
                    name: 'soLocation',
                    type: 'dropdown',
                    label: 'SO Location',
                    endpoint: 'locations',
                    required: true,
                    disabled: true,
                    width: '100%',
                },
            ],
        },
    ];

    const productColumns: Column<CartItem>[] = [
        { id: 'index', label: 'S.NO.', width: 60, render: (_, __, index) => index + 1 },
        { id: 'name', label: 'Product', width: 200, accessorKey: 'name' },
        { id: 'unitPrice', label: 'Unit Price', width: 100, accessorKey: 'singleUnitPrice', type: 'money' },
        { id: 'tax', label: 'Tax', width: 80, render: () => <Icon name="toggle-on" size={24} color="#3B82F6" /> },
        { id: 'units', label: 'Units', width: 80, render: (_, row: CartItem) => row.inventoryProducts?.length || 0 },
        { id: 'totalQty', label: 'Total Qty', width: 100, render: (_, row: CartItem) => `${(row.inventoryProducts || []).reduce((sum: number, ip) => sum + (ip.slab?.receivedSqrFt || 0), 0).toFixed(2)} SF` },
        {
            id: 'totalAmount', label: 'Total Amount', width: 120, align: 'right', render: (_, row: CartItem) => {
                const qty = (row.inventoryProducts || []).reduce((sum: number, ip) => sum + (ip.slab?.receivedSqrFt || 0), 0);
                return `$ ${(qty * parseFloat(row.singleUnitPrice || '0')).toFixed(2)}`;
            }
        },
    ];

    const slabColumns: Column<any>[] = [
        { id: 'serialNo', label: 'Serial No', accessorKey: 'combinedNumber' },
        { id: 'barcode', label: 'Barcode', accessorKey: 'slab.barcode' },
        { id: 'block', label: 'Block-Bundle', render: (_, row) => row.slab?.block || row.slab?.lot || '-' },
        { id: 'slabNo', label: 'Slab No', accessorKey: 'slab.serialNumber' },
        { id: 'location', label: 'Location(Bin)', render: (_, row) => row.bin ? `${row.bin.warehouse.location.locationName} (${row.bin.name})` : '-' },
        { id: 'qty', label: 'Qty(SF)', render: (_, row) => `${row.slab?.receivedSqrFt || 0} SF` },
        { id: 'status', label: 'Status', render: () => <Icon name="archive" size={20} color="#3B82F6" /> },
        { id: 'onHold', label: 'On Hold', render: () => <Caption color="#10B981">No</Caption> },
        {
            id: 'actions', label: 'Actions', width: 80, align: 'center', render: () => (
                <Icon name="delete-outline" size={20} color="#EF4444" />
            )
        },
    ];

    const handleCreateSO = async (data: CartFormData) => {
        if (cartItems.length === 0) {
            showErrorToast('Cart is empty');
            return;
        }

        try {
            const products = cartItems.flatMap(item =>
                item.inventoryProducts.map(ip => ({
                    inventoryProductId: ip.id,
                    unitPrice: item.singleUnitPrice,
                    taxApplied: true,
                }))
            );

            const payload = {
                soDate: new Date().toISOString().split('T')[0],
                customerPo: '',
                customerPoDate: new Date().toISOString().split('T')[0],
                expDeliveryDate: new Date().toISOString().split('T')[0],
                soLocationId: data.soLocation,
                customerId: data.customer,
                deliveryNotes: '',
                internalNotes: '',
                shippingAddressId: data.deliveryLocation,
                paymentTerms: 0,
                deliveryType: 'delivery',
                products: products,
            };

            const response = await services.getApiClient().post('/api/salesOrder', payload);
            if (response.data?.success) {
                showSuccessToast('Sales order created successfully');
                navigation.navigate(StackId.SALES, {
                    screen: ScreenId.SALES_ORDER_DETAIL,
                    params: { salesOrderId: response.data.data.salesOrder.id }
                });
            } else {
                showErrorToast(response.data?.message || 'Failed to create sales order');
            }
        } catch (error: any) {
            showErrorToast(error?.message || 'Error creating sales order');
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Spinner size="large" color={theme.primary?.val} />
            </View>
        );
    }

    const subTotal = cartItems.reduce((acc, item) => {
        return acc + (parseFloat(item.singleUnitPrice) * item.inventoryProducts.reduce((sum, ip) => sum + (ip.slab?.receivedSqrFt || 0), 0));
    }, 0);
    const taxRate = 0.07;
    const tax = subTotal * taxRate;
    const total = subTotal + tax;
    const items = [
        { label: 'Sub-Total:', value: subTotal },
        { label: 'Taxable:', value: subTotal, color: '#9CA3AF' },
        { label: 'Tax(7%)', value: tax },
        { label: 'Total', value: total, bold: true, divider: true, color: '#1E40AF' },
    ];

    return (
        <ScrollView style={{ backgroundColor: '#F9FAFB' }} contentContainerStyle={{ padding: 16 }}>
            <Heading1 style={{ marginBottom: 4 }}>Cart</Heading1>
            <Caption style={{ marginBottom: 20 }}>Manage and track all your sales orders</Caption>

            <YStack gap="$4" marginBottom="$4">
                {/* Customer & Location Section */}
                <YStack width="100%" gap="$4">
                    <Card elevated={true} style={{ padding: tokens.space[4].val, backgroundColor: 'white', borderRadius: tokens.radius[4].val }}>
                        <FormRenderer sections={formSections} form={form} />
                    </Card>
                </YStack>

                {/* Right Section: Cart Products */}
                <CardWithHeader>

                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <MobileTable
                            title="Cart Products"
                            columns={productColumns as any}
                            data={cartItems}
                            selectable={false}
                            cardLayout={false}
                            isChild={true}
                            expandableRows={{
                                isExpandable: () => true,
                                renderExpandedContent: (row: any) => row?.inventoryProducts ? (
                                    <MobileTable
                                        columns={slabColumns as any}
                                        data={row.inventoryProducts}
                                        isChild={true}
                                        cardLayout={false}
                                    />
                                ) : null
                            }}
                        />
                    </ScrollView>

                </CardWithHeader>

                {/* Totals Section */}
                <YStack alignSelf="flex-end" width={320}>
                    <FinancialSummary items={items} />
                </YStack>

                {/* Bottom Buttons */}
                <XStack justifyContent="flex-end" gap="$3" marginTop="$4">
                    <Button
                        title="Bulk Hold"
                        variant="secondary"
                        onPress={() => { }}
                        style={{ paddingHorizontal: 24 }}
                    />
                    <Button
                        title="Create SO"
                        variant="primary"
                        onPress={form.handleSubmit(handleCreateSO)}
                        style={{ paddingHorizontal: 24 }}
                    />
                </XStack>
            </YStack>
        </ScrollView>
    );
};

export default CartScreen;
