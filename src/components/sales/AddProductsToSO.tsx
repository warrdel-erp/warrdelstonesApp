import { Plus } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { Text, XStack, YStack, getTokens, useTheme } from 'tamagui';
import { useAsyncLoader } from '../../hooks';
import { services } from '../../network';
import { AppDialog } from '../ui/AppDialog';
import Button from '../ui/Button';
import MobileTable, { Column } from '../ui/MobileTable';

// Types based on API response
interface Slab {
    id: number;
    serialNumber: number;
    slabNumber: number;
    packageLength: number;
    packageWidth: number;
    receivingLength: number;
    receivingWidth: number;
    block: string;
    lot: string;
    barcode: string;
    status: string;
    packagedSqrFt: number;
    receivedSqrFt: number;
}

interface Bin {
    id: number;
    name: string;
    warehouse: {
        id: number;
        locationId: number;
        location: {
            location: string;
            id: number;
        };
    };
}

interface InventoryProduct {
    id: number;
    binId: number;
    siplId: number;
    sellingPrice: number;
    landedUnitCost: number;
    status: string;
    combinedNumber: string;
    productId: number;
    isSlabType: boolean;
    hold: string | null;
    slab: Slab;
    genericProduct: any | null;
    product: {
        id: number;
        name: string;
    };
    bin: Bin;
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
    singleUnitPrice: string;
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

export interface SelectedInventoryProduct {
    inventoryProductId: number;
    unitPrice: string;
    taxApplied: boolean;
}

interface AddProductsToSOProps {
    /** Callback when inventory products are selected */
    onProductsSelected?: (selectedProducts: SelectedInventoryProduct[]) => void;
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
    const [inventoryProductsCache, setInventoryProductsCache] = useState<Record<number, InventoryProduct[]>>({});
    const [selectedInventoryProducts, setSelectedInventoryProducts] = useState<Set<number>>(new Set());
    const [productPrices, setProductPrices] = useState<Record<number, string>>({}); // Store product prices by productId

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
                // Cache product prices
                const prices: Record<number, string> = {};
                response.data.data.forEach(product => {
                    prices[product.id] = product.singleUnitPrice || '0.00';
                });
                setProductPrices(prices);
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

    // Fetch inventory products for a specific product
    const fetchInventoryProducts = useCallback(async (productId: number) => {
        try {
            const response = await services.getApiClient().get<{
                success: boolean;
                message: string;
                data: InventoryProduct[];
            }>(
                '/api/inventoryProduct',
                {
                    params: {
                        productId: productId,
                        status: 'IN_INVENTORY',
                    },
                }
            );

            if (response.data?.success && response.data?.data) {
                setInventoryProductsCache(prev => ({
                    ...prev,
                    [productId]: response.data.data,
                }));
            }
        } catch (error) {
            console.error('Error fetching inventory products:', error);
        }
    }, []);

    // Fetch products when modal opens
    React.useEffect(() => {
        if (modalVisible) {
            run();
        }
    }, [modalVisible, run]);

    // Handle expanded rows changes
    const handleExpandedRowsChange = useCallback((rows: (string | number)[]) => {
        setExpandedRows(rows);

        // Find newly expanded rows
        const newlyExpanded = rows.filter(rowId => !expandedRows.includes(rowId));

        // Fetch inventory products for newly expanded rows
        newlyExpanded.forEach(rowId => {
            const productId = Number(rowId);
            // Only fetch if not already in cache
            if (!inventoryProductsCache[productId]) {
                fetchInventoryProducts(productId);
            }
        });
    }, [expandedRows, inventoryProductsCache, fetchInventoryProducts]);

    // Product table columns
    const productColumns: Column<Product>[] = useMemo(
        () => [
            {
                id: 'name',
                label: 'Product Name',
                accessorKey: 'name',
                sortable: true,
            },
            {
                id: 'category',
                label: 'Category',
                minWidth: 120,
                render: (_value: any, row: any) => (
                    <Text>
                        {row.isSlabType ? 'Slab' : 'Generic'}
                    </Text>
                )
            },
            {
                id: 'totalAvailableQuantity',
                label: 'Available Qty',
                accessorKey: 'totalAvailableQuantity',
                // align: 'right',
                type: 'number',
            },
            {
                id: 'totalAvailableUnits',
                label: 'Available Units',
                accessorKey: 'totalAvailableUnits',
                // align: 'right',
                type: 'number',
            },
        ],
        []
    );

    // Inventory Product table columns
    const inventoryProductColumns: Column<InventoryProduct>[] = useMemo(
        () => [
            { id: 'combinedNumber', label: 'Serial No', render: (_value, row) => row.combinedNumber },
            { id: 'barcode', label: 'Barcode', render: (_value, row) => row.slab?.barcode || row.genericProduct?.barcode },
            { id: 'blockBundle', label: 'Block-Bundle', render: (_value, row) => `${row?.slab?.block}-${row?.slab?.lot}` },
            { id: 'slabNumber', label: 'Slab No', render: (_value, row) => row.slab?.slabNumber },
            { id: 'location', label: 'Location(Bin)', render: (_value, row) => row?.bin?.name },
            { id: 'qty', label: 'Qty(SF)', render: (_value, row) => `${row?.slab?.receivingLength}*${row?.slab?.receivingWidth}=${(row?.slab?.receivingLength * row?.slab?.receivingWidth / 144).toFixed(2)}SF` },

        ],
        [tokens, theme]
    );

    const handleConfirmSelection = () => {
        if (onProductsSelected && selectedInventoryProducts.size > 0) {
            const selectedProducts: SelectedInventoryProduct[] = [];

            selectedInventoryProducts.forEach(inventoryProductId => {
                // Find the product that contains this inventory product
                let productId: number | null = null;
                for (const [pid, invProducts] of Object.entries(inventoryProductsCache)) {
                    if (invProducts.some(ip => ip.id === inventoryProductId)) {
                        productId = Number(pid);
                        break;
                    }
                }

                if (productId && productPrices[productId]) {
                    selectedProducts.push({
                        inventoryProductId,
                        unitPrice: productPrices[productId],
                        taxApplied: true,
                    });
                }
            });

            onProductsSelected(selectedProducts);
        }
        setModalVisible(false);
        setSelectedInventoryProducts(new Set());
    };

    const handleToggleInventoryProduct = (inventoryProductId: number) => {
        setSelectedInventoryProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(inventoryProductId)) {
                newSet.delete(inventoryProductId);
            } else {
                newSet.add(inventoryProductId);
            }
            return newSet;
        });
    };

    return (
        <>
            <Button
                title={buttonLabel}
                variant="outline"
                onPress={() => setModalVisible(true)}
                icon={<Plus size={20} />}
            />

            <AppDialog
                open={modalVisible}
                onOpenChange={setModalVisible}
                title="Select Products"
                maxWidth="95%"
                maxHeight="90%"
                footer={
                    <YStack gap={tokens.space[2].val} alignItems="flex-end">
                        <Text fontSize={tokens.size[3.5].val} color={theme.textSecondary?.val}>
                            {selectedInventoryProducts.size} inventory product(s) selected
                        </Text>
                        <XStack gap={tokens.space[2].val}>
                            <Button
                                title="Cancel"
                                variant="outline"
                                onPress={() => setModalVisible(false)}
                            />
                            <Button
                                title="Add Selected"
                                variant="primary"
                                onPress={handleConfirmSelection}
                                disabled={selectedInventoryProducts.size === 0}
                            />
                        </XStack>
                    </YStack>
                }
            >
                <YStack minHeight={400}>
                    <MobileTable
                        columns={productColumns as Column<Record<string, any>>[]}
                        data={products as Record<string, any>[]}
                        loading={loading}
                        clickable={true}
                        onRowClick={(row: Record<string, any>) => {
                            console.log('Product clicked:', row);
                        }}
                        emptyMessage="No products available"
                        isChild={false}
                        expandableRows={{
                            expandedRows: expandedRows,
                            onExpandedRowsChange: handleExpandedRowsChange,
                            renderExpandedContent: (row: Record<string, any>) => {
                                const product = row as Product;
                                const inventoryProducts = inventoryProductsCache[product.id] || [];

                                return (
                                    <YStack
                                        gap={tokens.space[2].val}
                                    >
                                        <MobileTable
                                            selectable
                                            selectedRows={Array.from(selectedInventoryProducts)}
                                            onSelectionChange={(selected) => {
                                                setSelectedInventoryProducts(new Set(selected as number[]));
                                            }}
                                            columns={inventoryProductColumns as Column<Record<string, any>>[]}
                                            data={inventoryProducts as Record<string, any>[]}
                                            clickable={true}
                                            onRowClick={(inventoryProduct: Record<string, any>) => {
                                                handleToggleInventoryProduct(inventoryProduct.id);
                                            }}
                                            emptyMessage="No inventory products available"
                                            isChild={true}
                                            maxHeight={300}
                                        />
                                    </YStack>
                                );
                            },
                        }}
                    />
                </YStack>
            </AppDialog>
        </>
    );
};

export default AddProductsToSO;

