import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { YStack, getTokens, useTheme } from 'tamagui';
import { z } from 'zod';
import { AddProductsToSO, SelectedInventoryProduct } from '../../components/sales/AddProductsToSO';
import SelectedProductsSummary from '../../components/sales/SelectedProductsSummary';
import Button from '../../components/ui/Button';
import FormRenderer, { FormSectionConfig } from '../../components/ui/FormRenderer';
import { ScreenId } from '../../navigation/navigationConstants';
import { services } from '../../network';
import { useAuthState } from '../../store/hooks';
import { showErrorToast, showSuccessToast } from '../../utils';


const salesOrderSchema = z.object({
    customer: z.number({ message: 'Customer is required' }).min(1, 'Customer is required'),
    deliveryLocation: z.number({ message: 'Delivery Location is required' }).min(1, 'Delivery Location is required'),
    soLocation: z.number({ message: 'SO Location is required' }).min(1, 'SO Location is required'),
    printedNotes: z.string().optional(),
    internalNotes: z.string().optional(),
    soDate: z.date({ message: 'SO Date is required' }),
    customerPo: z.string().optional(),
    customerPoDate: z.date({ message: 'Customer PO Date is required' }),
    expDelivery: z.date({ message: 'Expected Delivery Date is required' }),
    paymentTerms: z.number().optional(),
});

type SalesOrderFormData = z.infer<typeof salesOrderSchema>;

interface SalesOrderPayload {
    soDate: string;
    customerPo: string;
    customerPoDate: string;
    expDeliveryDate: string;
    soLocationId: number;
    customerId: number;
    deliveryNotes: string;
    internalNotes: string;
    shippingAddressId: number;
    paymentTerms: number;
    deliveryType: string;
    products: SelectedInventoryProduct[];
}

export const AddSalesOrderScreen: React.FC = () => {
    const tokens = getTokens();
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const [selectedProducts, setSelectedProducts] = React.useState<SelectedInventoryProduct[]>([]);


    const auth = useAuthState()

    console.log('ddddddd', auth)

    const form = useForm<SalesOrderFormData>({
        resolver: zodResolver(salesOrderSchema),
        defaultValues: {
            customer: undefined as any,
            deliveryLocation: undefined as any,
            soLocation: undefined as any,
            printedNotes: '',
            internalNotes: '',
            soDate: undefined as any,
            customerPo: '',
            customerPoDate: undefined as any,
            expDelivery: undefined as any,
            paymentTerms: undefined,
        },
    });

    React.useEffect(() => {
        if (auth.me?.defaultLocationId) {
            form.setValue('soLocation', auth.me.defaultLocationId);
        }
    }, [auth.me?.defaultLocationId, form]);


    const watchedCustomerId = form.watch('customer');

    const onSubmit = async (data: any) => {
        try {
            if (selectedProducts.length === 0) {
                showErrorToast('Please add at least one product');
                return;
            }

            const formatDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const payload: SalesOrderPayload = {
                soDate: formatDate(data.soDate),
                customerPo: data.customerPo || '',
                customerPoDate: formatDate(data.customerPoDate),
                expDeliveryDate: formatDate(data.expDelivery),
                soLocationId: data.soLocation,
                customerId: data.customer,
                deliveryNotes: data.printedNotes || '',
                internalNotes: data.internalNotes || '',
                shippingAddressId: data.deliveryLocation,
                paymentTerms: data.paymentTerms || 0,
                deliveryType: 'delivery',
                products: selectedProducts.map(p => ({
                    inventoryProductId: p.inventoryProductId,
                    unitPrice: p.unitPrice,
                    taxApplied: p.taxApplied
                })),
            };

            console.log('Submitting Sales Order:', payload);

            const response = await services.getApiClient().post('/api/salesOrder', payload);

            if (response.data?.success) {
                showSuccessToast('Sales order created successfully');
                const orderId = response.data?.data?.salesOrder.id;

                // Reset form and products
                form.reset();
                setSelectedProducts([]);

                if (orderId) {
                    navigation.navigate(ScreenId.SALES_ORDER_DETAIL, { salesOrderId: orderId });
                }
            } else {

                showErrorToast(response.data?.message || 'Failed to create sales order');
            }
        } catch (error: any) {
            console.error('Error creating sales order:', error);
            showErrorToast(error?.message || 'Failed to create sales order');
        }
    };

    const formSections: FormSectionConfig[] = React.useMemo(
        () => [
            {
                id: 'salesOrderDetails',
                title: 'Sales Order Details',
                fields: [
                    {
                        name: 'customer',
                        type: 'dropdown',
                        label: 'Customer',
                        endpoint: 'customers',
                        required: true,
                        width: '48%',
                    },
                    {
                        name: 'deliveryLocation',
                        type: 'dropdown',
                        label: 'Delivery Location',
                        endpoint: watchedCustomerId
                            ? `customer/${watchedCustomerId}/addresses`
                            : undefined,
                        queryParams: watchedCustomerId
                            ? { addressType: 'shipping' }
                            : undefined,
                        required: true,
                        selectFirstByDefault: true,
                        width: '48%',
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
            {
                id: 'notes',
                title: 'Notes',
                fields: [
                    {
                        name: 'printedNotes',
                        type: 'textarea',
                        label: 'Add Printed Notes',
                        placeholder: 'Enter printed notes',
                        width: '100%',
                    },
                    {
                        name: 'internalNotes',
                        type: 'textarea',
                        label: 'Add Internal Notes',
                        placeholder: 'Enter internal notes',
                        width: '100%',
                    },
                ],
            },
            {
                id: 'invoiceDetails',
                title: 'Invoice Details',
                fields: [
                    {
                        name: 'soDate',
                        type: 'date',
                        label: 'SO Date',
                        required: true,
                        width: '48%',
                    },
                    {
                        name: 'customerPo',
                        type: 'text',
                        label: 'Customer PO',
                        placeholder: 'Enter customer PO',
                        width: '48%',
                    },
                    {
                        name: 'customerPoDate',
                        type: 'date',
                        label: 'Customer PO Date',
                        required: true,
                        width: '48%',
                    },
                    {
                        name: 'expDelivery',
                        type: 'date',
                        label: 'Exp. Delivery',
                        required: true,
                        width: '48%',
                    },
                    {
                        name: 'paymentTerms',
                        type: 'dropdown',
                        label: 'Payment Terms',
                        endpoint: 'paymentTerms',
                        width: '48%',
                    },
                ],
            },
        ],
        [watchedCustomerId],
    );


    const handleDeleteProduct = (productId: number, serialNo?: string) => {
        if (serialNo) {
            // Delete specific inventory item
            setSelectedProducts(prev => prev.filter(p => p.details?.combinedNumber !== serialNo));
        } else {
            // Delete all items of this product
            setSelectedProducts(prev => prev.filter(p => p.details?.productId !== productId));
        }
    };


    const handleToggleTax = (productId: number, checked: boolean) => {
        setSelectedProducts(prev => prev.map(p => {
            if (p.details?.productId === productId) {
                return { ...p, taxApplied: checked };
            }
            return p;
        }));
    };

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.backgroundSecondary?.val || '#F3F4F6',
            }}
        >
            <ScrollView
                contentContainerStyle={{
                    padding: tokens.space[4].val,
                    paddingBottom: tokens.space[8].val,
                }}
            >
                <YStack gap={tokens.space[4].val}>
                    <FormRenderer sections={formSections} form={form} />

                    <AddProductsToSO
                        buttonLabel={`Add Products ${selectedProducts.length > 0 ? `(${selectedProducts.length})` : ''}`}
                        onProductsSelected={(products) => {
                            setSelectedProducts(prev => [...prev, ...products]);
                            showSuccessToast(`Added ${products.length} product(s) to order`);
                        }}
                    />

                    <SelectedProductsSummary
                        selectedProducts={selectedProducts}
                        onDeleteProduct={handleDeleteProduct}
                        onToggleTax={handleToggleTax}
                    />

                    <Button
                        title="Create Sales Order"
                        variant="primary"
                        onPress={form.handleSubmit(onSubmit)}
                        style={{ marginTop: tokens.space[2].val }}
                    />
                </YStack>
            </ScrollView>
        </View>
    );
};

export default AddSalesOrderScreen;

