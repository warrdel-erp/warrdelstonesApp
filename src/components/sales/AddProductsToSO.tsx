import { Package, Plus } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Text, YStack, getTokens, useTheme } from 'tamagui';
import { useAsyncLoader } from '../../hooks';
import { services } from '../../network';
import Button from '../ui/Button';
import MobileTable, { Column, RowAction } from '../ui/MobileTable';

// Types based on API response
interface Slab {
    id: number;
    receivingLength: number;
    receivingWidth: number;
}

interface InventoryProduct {
    id: number;
    status: string;
    isSlabType: boolean;
    hold: string | null;
    slab: Slab;
}

interface Product {
    id: number;
    name: string;
    alternativeName: string;
    origin: {
        id: number;
        name: string;
    };
    uom: {
        id: number;
        name: string;
        code: string;
    };
    totalAvailableQuantity: string;
    totalAvailableUnits: number;
    inventoryProducts: InventoryProduct[];
    [key: string]: any;
}

interface CompactProductResponse {
    success: boolean;
    message: string;
    data: Product[];
    paginationData: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface AddProductsToSOProps {
    /** Callback when products are selected */
    onProductsSelected?: (selectedProducts: Product[]) => void;
    /** Button label */
    buttonLabel?: string;
}

export const AddProductsToSO: React.FC<AddProductsToSOProps> = ({
    onProductsSelected,
    buttonLabel = 'Add Products',
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        try {
            // Use GET request as specified by user
            const response = await services.getApiClient().get<CompactProductResponse>(
                '/api/product/compact',
                {
                    params: { onlyWithSlabs: 1 },
                }
            );

            // response.data is the CompactProductResponse
            if (response.data?.success && response.data?.data) {
                setProducts(response.data.data);
            } else {
                console.error('Failed to fetch products:', response.data?.message);
                setProducts([]);
            }
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    }, []);

    const { loading, error, run } = useAsyncLoader(fetchProducts);

    // Fetch products when modal opens
    React.useEffect(() => {
        if (modalVisible) {
            run();
        }
    }, [modalVisible, run]);

    // Product table columns
    const productColumns: Column<Product>[] = useMemo(
        () => [
            {
                id: 'name',
                label: 'Product Name',
                accessorKey: 'name',
                width: '25%',
                sortable: true,
            },
            {
                id: 'alternativeName',
                label: 'Alternative Name',
                accessorKey: 'alternativeName',
                width: '25%',
                sortable: true,
            },
            {
                id: 'origin',
                label: 'Origin',
                accessorKey: 'origin.name',
                width: '15%',
                sortable: true,
            },
            {
                id: 'uom',
                label: 'UOM',
                accessorKey: 'uom.name',
                width: '10%',
            },
            {
                id: 'totalAvailableQuantity',
                label: 'Available Qty',
                accessorKey: 'totalAvailableQuantity',
                width: '15%',
                align: 'right',
                type: 'number',
            },
            {
                id: 'totalAvailableUnits',
                label: 'Available Units',
                accessorKey: 'totalAvailableUnits',
                width: '10%',
                align: 'right',
                type: 'number',
            },
        ],
        []
    );

    // Inventory Product table columns
    const inventoryProductColumns: Column<InventoryProduct>[] = useMemo(
        () => [
            {
                id: 'id',
                label: 'ID',
                accessorKey: 'id',
                width: '15%',
                type: 'number',
            },
            {
                id: 'slabLength',
                label: 'Length',
                accessorKey: 'slab.receivingLength',
                width: '15%',
                type: 'number',
                render: (value, row) => (
                    <Text fontSize={tokens.size[3.5].val} color={theme.textPrimary?.val}>
                        {row.slab?.receivingLength || '-'}
                    </Text>
                ),
            },
            {
                id: 'slabWidth',
                label: 'Width',
                accessorKey: 'slab.receivingWidth',
                width: '15%',
                type: 'number',
                render: (value, row) => (
                    <Text fontSize={tokens.size[3.5].val} color={theme.textPrimary?.val}>
                        {row.slab?.receivingWidth || '-'}
                    </Text>
                ),
            },
            {
                id: 'hold',
                label: 'Hold',
                accessorKey: 'hold',
                width: '20%',
                render: (value) => (
                    <Text
                        fontSize={tokens.size[3.5].val}
                        color={value ? theme.statusWarning?.val : theme.textSecondary?.val}
                    >
                        {value || 'No'}
                    </Text>
                ),
            },
            {
                id: 'isSlabType',
                label: 'Slab Type',
                accessorKey: 'isSlabType',
                width: '15%',
                type: 'boolean',
                render: (value) => (
                    <Text fontSize={tokens.size[3.5].val} color={theme.textPrimary?.val}>
                        {value ? 'Yes' : 'No'}
                    </Text>
                ),
            },
        ],
        [tokens, theme]
    );

    // Product row actions
    const productRowActions: RowAction<Product>[] = useMemo(
        () => [
            {
                id: 'select',
                label: 'Select Product',
                icon: <Package size={16} color={theme.primary?.val} />,
                onClick: (row) => {
                    if (onProductsSelected) {
                        onProductsSelected([row]);
                    }
                    setModalVisible(false);
                },
            },
        ],
        [onProductsSelected, theme]
    );

    // Inventory product row actions
    const inventoryProductRowActions: RowAction<InventoryProduct>[] = useMemo(
        () => [
            {
                id: 'select',
                label: 'Select Inventory',
                icon: <Package size={16} color={theme.primary?.val} />,
                onClick: (row) => {
                    console.log('Selected inventory product:', row);
                    // You can add logic here to select individual inventory products
                },
            },
        ],
        [theme]
    );

    return (
        <>
            <Button
                title={buttonLabel}
                variant="outline"
                onPress={() => setModalVisible(true)}
                icon={<Plus size={20} />}
            />

            {/* <AppDialog
                open={modalVisible}
                onOpenChange={setModalVisible}
                title="Select Products"
                maxWidth="95%"
                maxHeight="90%"
            > */}
            <YStack minHeight={400}>
                <MobileTable
                    columns={productColumns as Column<Record<string, any>>[]}
                    data={products as Record<string, any>[]}
                    loading={loading}
                    rowActions={productRowActions as RowAction<Record<string, any>>[]}
                    clickable={true}
                    onRowClick={(row: Record<string, any>) => {
                        console.log('Product clicked:', row);
                    }}
                    emptyMessage="No products available"
                    isChild={false}
                    expandableRows={{
                        expandedRows: expandedRows,
                        onExpandedRowsChange: (rows: (string | number)[]) => {
                            setExpandedRows(rows);
                        },
                        renderExpandedContent: (row: Record<string, any>) => {
                            const product = row as Product;
                            const inventoryProducts = product.inventoryProducts || [];

                            return (

                                <MobileTable
                                    columns={inventoryProductColumns as Column<Record<string, any>>[]}
                                    data={inventoryProducts as Record<string, any>[]}
                                    rowActions={inventoryProductRowActions as RowAction<Record<string, any>>[]}
                                    clickable={true}
                                    onRowClick={(inventoryProduct: Record<string, any>) => {
                                        console.log('Inventory product clicked:', inventoryProduct);
                                    }}
                                    emptyMessage="No inventory products available"
                                    isChild={true}
                                    maxHeight={300}
                                />
                            );
                        },
                    }}
                />
            </YStack>
            {/* </AppDialog> */}
        </>
    );
};

export default AddProductsToSO;

