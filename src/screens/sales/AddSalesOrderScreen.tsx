import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Text, YStack, getTokens, useTheme } from 'tamagui';
import { z } from 'zod';
import { AddProductsToSO, SelectedInventoryProduct } from '../../components/sales/AddProductsToSO';
import Button from '../../components/ui/Button';
import FormRenderer, { FormSectionConfig } from '../../components/ui/FormRenderer';
import { services } from '../../network';
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
    const [selectedProducts, setSelectedProducts] = React.useState<SelectedInventoryProduct[]>([]);

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
                products: selectedProducts,
            };

            console.log('Submitting Sales Order:', payload);

            const response = await services.getApiClient().post('/api/salesOrder', payload);

            if (response.data?.success) {
                showSuccessToast('Sales order created successfully');
                // Reset form and products
                form.reset();
                setSelectedProducts([]);
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
                        width: '48%',
                    },
                    {
                        name: 'soLocation',
                        type: 'dropdown',
                        label: 'SO Location',
                        endpoint: 'locations',
                        required: true,
                        width: '48%',
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

                    {selectedProducts.length > 0 && (
                        <YStack
                            padding={tokens.space[3].val}
                            backgroundColor={theme.backgroundHover?.val}
                            borderRadius={tokens.radius[3].val}
                        >
                            <Text
                                fontSize={tokens.size[4].val}
                                fontWeight="600"
                                color={theme.textPrimary?.val}
                            >
                                {selectedProducts.length} product(s) added to order
                            </Text>
                        </YStack>
                    )}

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

