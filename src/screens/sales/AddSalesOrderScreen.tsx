import React from 'react';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { YStack, getTokens, useTheme } from 'tamagui';
import { AddProductsToSO } from '../../components/sales/AddProductsToSO';
import Button from '../../components/ui/Button';
import FormRenderer, { FormSectionConfig } from '../../components/ui/FormRenderer';
import { showErrorToast } from '../../utils';

interface SalesOrderFormData {
    customer: number;
    deliveryLocation: number;
    soLocation: number;
    printedNotes: string;
    internalNotes: string;
    soDate: Date;
    customerPo: string;
    customerPoDate: Date;
    expDelivery: Date;
    paymentTerms: number;
}

export const AddSalesOrderScreen: React.FC = () => {
    const tokens = getTokens();
    const theme = useTheme();
    const form = useForm<SalesOrderFormData>({
        defaultValues: {
            customer: undefined,
            deliveryLocation: undefined,
            soLocation: undefined,
            printedNotes: '',
            internalNotes: '',
            soDate: undefined,
            customerPo: '',
            customerPoDate: undefined,
            expDelivery: undefined,
            paymentTerms: undefined,
        },
    });

    const watchedCustomerId = form.watch('customer');

    const onSubmit = async (data: SalesOrderFormData) => {
        try {
            console.log('Form data:', data);
            // TODO: Implement API call to create sales order
            // await services.sales.createSalesOrder(data);
            // showErrorToast('Sales order created successfully');
        } catch (error) {
            showErrorToast('Failed to create sales order');
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
                        buttonLabel="Add Products"
                        onProductsSelected={(products) => {
                            console.log('Selected products:', products);
                            // TODO: Handle selected products
                        }}
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

