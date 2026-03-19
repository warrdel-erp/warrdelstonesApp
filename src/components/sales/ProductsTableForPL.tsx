import { ArrowRightLeft } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import { BodyText, Button } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import FormTextInput from '../ui/FormTextInput';
import MobileTable, { Column } from '../ui/MobileTable';

export interface ProductForPL {
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
}

export interface SelectedProduct {
    salesOrderProductId: number;
    plRemeasureLength?: number;
    plRemeasureWidth?: number;
}

export interface ProductsTableForPLProps {
    products: ProductForPL[];
    selectedProducts: Map<number, SelectedProduct>;
    onRemeasureChange: (salesOrderProductId: number, length?: number, width?: number) => void;
    taxPercentage: number;
}

interface ProductRow {
    id: number;
    productName: string;
    description: string;
    unitPrice: number;
    loadingQty: number;
    loadingTotal: number;
    loadingTax: number;
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
    loRemeasureLength?: number;
    loRemeasureWidth?: number;
    plRemeasureLength?: number;
    plRemeasureWidth?: number;
    calculatedQty: number;
}

const ProductsTableForPL: React.FC<ProductsTableForPLProps> = ({
    products,
    selectedProducts,
    onRemeasureChange,
    taxPercentage,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    // Transform products data
    const productRows: ProductRow[] = products.map(product => {
        const unitPrice = parseFloat(product.unitPrice || '0');
        const productSalesOrderProducts = product.salesOrderProduct;

        let loadingQty = 0;
        let loadingTotal = 0;

        const inventoryItems: InventoryItem[] = productSalesOrderProducts.map(sop => {
            const selected = selectedProducts.get(sop.id);

            // For display: use plRemeasure if available, otherwise use loRemeasure, otherwise use receiving dimensions
            const plRemeasureLength = selected?.plRemeasureLength !== undefined
                ? selected.plRemeasureLength
                : (sop.loRemeasureLength !== undefined ? sop.loRemeasureLength : sop.inventoryProduct.slab.receivingLength);
            const plRemeasureWidth = selected?.plRemeasureWidth !== undefined
                ? selected.plRemeasureWidth
                : (sop.loRemeasureWidth !== undefined ? sop.loRemeasureWidth : sop.inventoryProduct.slab.receivingWidth);

            // For calculation, use plRemeasure if available, otherwise use loRemeasure, otherwise receiving
            const calcLength = selected?.plRemeasureLength !== undefined
                ? selected.plRemeasureLength
                : (sop.loRemeasureLength !== undefined ? sop.loRemeasureLength : sop.inventoryProduct.slab.receivingLength);
            const calcWidth = selected?.plRemeasureWidth !== undefined
                ? selected.plRemeasureWidth
                : (sop.loRemeasureWidth !== undefined ? sop.loRemeasureWidth : sop.inventoryProduct.slab.receivingWidth);
            const calculatedQty = (calcLength * calcWidth) / 144; // Convert to square feet

            loadingQty += calculatedQty;
            loadingTotal += calculatedQty * unitPrice;

            return {
                salesOrderProductId: sop.id,
                serialNo: sop.inventoryProduct.combinedNumber,
                barcode: sop.inventoryProduct.slab.barcode,
                blockBundle: `${sop.inventoryProduct.slab.block}-${sop.inventoryProduct.slab.lot}`,
                slabNo: sop.inventoryProduct.slab.slabNumber.toString(),
                location: sop.inventoryProduct.bin.name,
                qtySf: `${sop.inventoryProduct.slab.receivingLength} x ${sop.inventoryProduct.slab.receivingWidth} = ${sop.loSqrFt.toFixed(2)} SF`,
                loRemeasureLength: sop.loRemeasureLength,
                loRemeasureWidth: sop.loRemeasureWidth,
                plRemeasureLength,
                plRemeasureWidth,
                calculatedQty,
            };
        });

        const loadingTax = loadingTotal * (taxPercentage / 100);

        return {
            id: product.id,
            productName: product.name,
            description: '',
            unitPrice,
            loadingQty,
            loadingTotal,
            loadingTax,
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
            id: 'loadingQty',
            label: 'Loading Qty',
            accessorKey: 'loadingQty',
            align: 'right',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${value.toFixed(2)} SF` : value}</BodyText>
            ),
        },
        {
            id: 'unitPrice',
            label: 'Unit Price',
            accessorKey: 'unitPrice',
            align: 'right',
            type: 'money',
        },
        {
            id: 'qty',
            label: 'Qty',
            accessorKey: 'loadingQty',
            align: 'right',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${value.toFixed(2)} SF` : value}</BodyText>
            ),
        },
        {
            id: 'amt',
            label: 'Amt',
            accessorKey: 'loadingTotal',
            align: 'right',
            type: 'money',
        },
        {
            id: 'tax',
            label: 'Tax',
            accessorKey: 'loadingTax',
            align: 'center',
            render: (_value, row) => (
                <BodyText>{`${taxPercentage}%`}</BodyText>
            ),
        },
    ];

    const inventoryColumns: Column<InventoryItem>[] = [
        {
            id: 'serialNo',
            label: 'Serial Num',
            accessorKey: 'serialNo',
            width: 80,
        },
        {
            id: 'barcode',
            label: 'Barcode#',
            accessorKey: 'barcode',
            width: 100,
        },
        {
            id: 'blockBundle',
            label: 'Block-Bundle',
            accessorKey: 'blockBundle',
            width: 100,
            render: (value) => <BodyText>{value || '-'}</BodyText>,
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
            width: 100,
        },
        {
            id: 'quantity',
            label: 'Loading Quantity',
            accessorKey: 'qtySf',
        },
        {
            id: 'remeasure',
            label: 'Re-Measure',
            render: (_value, row) => {
                const displayLength = row.plRemeasureLength !== undefined ? row.plRemeasureLength : '';
                const displayWidth = row.plRemeasureWidth !== undefined ? row.plRemeasureWidth : '';

                return (
                    <XStack alignItems="center" gap={tokens.space[1].val} flexWrap="wrap">
                        <YStack width={70}>
                            <FormTextInput
                                value={displayLength}
                                onChange={(val) => {
                                    const numVal = (val as number);
                                    onRemeasureChange(row.salesOrderProductId, numVal, row.plRemeasureWidth);
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
                                    onRemeasureChange(row.salesOrderProductId, row.plRemeasureLength, numVal);
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
                return (
                    <Button
                        title="Swap"
                        variant="outline"
                        size="small"
                        icon={<ArrowRightLeft size={16} color={theme.primary?.val || '#0891B2'} />}
                        onPress={() => {
                            // TODO: Implement swap functionality
                        }}
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

export default ProductsTableForPL;



