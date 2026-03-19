import { ArrowRightLeft } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import { BodyText, Button } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import { CheckBox } from '../ui/CheckBox';
import FormTextInput from '../ui/FormTextInput';
import MobileTable, { Column } from '../ui/MobileTable';

export interface ProductForLO {
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
}

export interface SelectedProduct {
    salesOrderProductId: number;
    loRemeasureLength?: number;
    loRemeasureWidth?: number;
}

export interface ProductsTableForLOProps {
    products: ProductForLO[];
    selectedProducts: Map<number, SelectedProduct>;
    onProductSelectionChange: (salesOrderProductId: number, selected: boolean, remeasureLength?: number, remeasureWidth?: number) => void;
    onRemeasureChange: (salesOrderProductId: number, length?: number, width?: number) => void;
    taxPercentage: number;
}

interface ProductRow {
    id: number;
    productName: string;
    description: string;
    unitPrice: number;
    selectedQty: number;
    selectedTotal: number;
    selectedTax: number;
    inventoryItems: InventoryItem[];
}

interface InventoryItem {
    salesOrderProductId: number;
    serialNo: string;
    barcode: string;
    blockBundle: string;
    slabNo: string;
    location: string;
    qtySf: string;
    receivingLength: number;
    receivingWidth: number;
    remeasureLength?: number;
    remeasureWidth?: number;
    calculatedQty: number;
}

const ProductsTableForLO: React.FC<ProductsTableForLOProps> = ({
    products,
    selectedProducts,
    onProductSelectionChange,
    onRemeasureChange,
    taxPercentage,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    console.log('products', products)

    // Transform products data
    const productRows: ProductRow[] = products.map(product => {
        const unitPrice = parseFloat(product.unitPrice || '0');
        const productSalesOrderProducts = product.salesOrderProduct

        let selectedQty = 0;
        let selectedTotal = 0;

        const inventoryItems: InventoryItem[] = productSalesOrderProducts.map(sop => {
            const isSelected = selectedProducts.has(sop.id);
            const selected = selectedProducts.get(sop.id);
            const hasStoredDimensions = selected !== undefined;

            // For display: if user has interacted (stored in map), use stored value (undefined = empty)
            // If not in map, show default receiving dimensions
            const remeasureLength = hasStoredDimensions
                ? selected?.loRemeasureLength
                : sop.inventoryProduct.slab.receivingLength;
            const remeasureWidth = hasStoredDimensions
                ? selected?.loRemeasureWidth
                : sop.inventoryProduct.slab.receivingWidth;

            // For calculation, use remeasure if available, otherwise fall back to receiving dimensions
            const calcLength = (selected?.loRemeasureLength !== undefined)
                ? selected.loRemeasureLength
                : sop.inventoryProduct.slab.receivingLength;
            const calcWidth = (selected?.loRemeasureWidth !== undefined)
                ? selected.loRemeasureWidth
                : sop.inventoryProduct.slab.receivingWidth;
            const calculatedQty = (calcLength * calcWidth) / 144; // Convert to square feet

            if (isSelected) {
                selectedQty += calculatedQty;
                selectedTotal += calculatedQty * unitPrice;
            }

            return {
                salesOrderProductId: sop.id,
                serialNo: sop.inventoryProduct.combinedNumber,
                barcode: sop.inventoryProduct.slab.barcode,
                blockBundle: `${sop.inventoryProduct.slab.block}-${sop.inventoryProduct.slab.lot}`,
                slabNo: sop.inventoryProduct.slab.slabNumber.toString(),
                location: `${sop.inventoryProduct.bin.warehouse.location.location} (${sop.inventoryProduct.bin.name})`,
                qtySf: `${sop.inventoryProduct.slab.receivingLength}*${sop.inventoryProduct.slab.receivingWidth}=${sop.receivingAreaSqFt.toFixed(2)} SF`,
                receivingLength: sop.inventoryProduct.slab.receivingLength,
                receivingWidth: sop.inventoryProduct.slab.receivingWidth,
                remeasureLength,
                remeasureWidth,
                calculatedQty,
            };
        });

        const selectedTax = selectedTotal * (taxPercentage / 100);

        return {
            id: product.id,
            productName: product.name,
            description: '',
            unitPrice,
            selectedQty,
            selectedTotal,
            selectedTax,
            inventoryItems,
        };
    });

    const columns: Column<ProductRow>[] = [
        {
            id: 'sn',
            label: 'SN',
            accessorKey: 'id',
            align: 'center',
            width: 60,
        },
        {
            id: 'product',
            label: 'Product(SKU)',
            accessorKey: 'productName',
            render: (value) => (
                <BodyText color={theme.textPrimary?.val || '#1F2937'} style={{ fontWeight: '500' }}>
                    {value || '-'}
                </BodyText>
            ),
        },
        {
            id: 'description',
            label: 'Description',
            accessorKey: 'description',
            render: (value) => <BodyText>{value || '--'}</BodyText>,
        },
        {
            id: 'unitPrice',
            label: 'Unit Price',
            accessorKey: 'unitPrice',
            align: 'right',
            type: 'money',
        },
        {
            id: 'selectedQty',
            label: 'Selected Qty',
            accessorKey: 'selectedQty',
            align: 'right',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${value.toFixed(2)} SF` : value}</BodyText>
            ),
        },
        {
            id: 'selectedTotal',
            label: 'Selected Total',
            accessorKey: 'selectedTotal',
            align: 'right',
            type: 'money',
        },
        {
            id: 'selectedTax',
            label: 'Selected Tax',
            accessorKey: 'selectedTax',
            align: 'center',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${taxPercentage}%` : value}</BodyText>
            ),
        },
    ];

    const inventoryColumns: Column<InventoryItem>[] = [
        {
            id: 'checkbox',
            label: '',
            width: 50,
            render: (_value, row) => {
                const isSelected = selectedProducts.has(row.salesOrderProductId);
                return (
                    <CheckBox
                        checked={isSelected}
                        onChange={(checked) => {
                            const item = row;
                            onProductSelectionChange(
                                row.salesOrderProductId,
                                checked,
                                item.remeasureLength,
                                item.remeasureWidth,
                            );
                        }}
                        size="small"
                    />
                );
            },
        },
        {
            id: 'serialNo',
            label: 'Serial Num',
            accessorKey: 'serialNo',
            width: 80,
        },
        {
            id: 'blockBundle',
            label: 'BL-BN-SN',
            render(value, row, index) {
                return `${row.blockBundle}-${row.slabNo}`;
            },
            width: 80,

        },
        {
            id: 'slabNo',
            label: 'Slab Num',
            accessorKey: 'slabNo',
            width: 80,

        },
        {
            id: 'location',
            label: 'Location(Bin)',
            accessorKey: 'location',
        },
        {
            id: 'quantity',
            label: 'Quantity',
            accessorKey: 'qtySf',
        },
        {
            id: 'remeasure',
            label: 'Re-Measure',
            render: (_value, row) => {
                // Display: if remeasureLength is undefined and it's a number (default), show it
                // If it's undefined because user cleared it, show empty
                const displayLength = row.remeasureLength || '';
                const displayWidth = row.remeasureWidth || '';

                return (
                    <XStack alignItems="center" gap={tokens.space[1].val} flexWrap="wrap">
                        <YStack width={70}>
                            <FormTextInput
                                value={displayLength}
                                onChange={(val) => {
                                    const numVal = (val as number);
                                    onRemeasureChange(row.salesOrderProductId, numVal, row.remeasureWidth);
                                }}
                                type="number"
                            />
                        </YStack>
                        <BodyText>x</BodyText>
                        <YStack width={70}>
                            <FormTextInput
                                value={displayWidth}
                                onChange={(val) => {
                                    const numVal = (val as number);
                                    onRemeasureChange(row.salesOrderProductId, row.remeasureLength, numVal);
                                }}
                                type="number"
                            />
                        </YStack>
                        <BodyText>=</BodyText>
                        <BodyText style={{ minWidth: 80 }}>
                            {row.calculatedQty.toFixed(2)} SF
                        </BodyText>
                    </XStack>
                );
            },
        },
        {
            id: 'swap',
            label: 'Swap',
            render: (_value, row) => {
                const isSelected = selectedProducts.has(row.salesOrderProductId);
                return (
                    <Button
                        title="Swap"
                        variant="outline"
                        size="small"
                        icon={<ArrowRightLeft size={16} color={theme.primary?.val || '#0891B2'} />}
                        onPress={() => {
                            // TODO: Implement swap functionality
                        }}
                        disabled={!isSelected}
                    />
                );
            },
        },
    ];

    return (
        <CardWithHeader title="Products">
            <MobileTable
                columns={columns as Column<Record<string, any>>[]}
                data={productRows as Record<string, any>[]}
                emptyMessage="No products available"
                isChild={false}
                expandableRows={{
                    expandedRows,
                    onExpandedRowsChange: setExpandedRows,
                    isExpandable: (row: Record<string, any>) => row.inventoryItems && row.inventoryItems.length > 0,
                    renderExpandedContent: (row: Record<string, any>) => {
                        if (!row.inventoryItems || row.inventoryItems.length === 0) {
                            return null;
                        }

                        return (
                            <YStack
                                paddingLeft={tokens.space[6].val}
                                paddingTop={tokens.space[3].val}
                                borderLeftWidth={2}
                                borderLeftColor={theme.blue8?.val || '#3B82F6'}
                                marginLeft={tokens.space[4].val}>
                                <MobileTable
                                    columns={inventoryColumns as Column<Record<string, any>>[]}
                                    data={row.inventoryItems as Record<string, any>[]}
                                    emptyMessage="No inventory items"
                                    isChild={true}
                                />
                            </YStack>
                        );
                    },
                }}
            />
        </CardWithHeader>
    );
};

export default ProductsTableForLO;
