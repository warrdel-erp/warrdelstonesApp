import { ArrowRightLeft, History } from '@tamagui/lucide-icons';

import React, { useState } from 'react';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import { BodyText, Button } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import MobileTable, { Column } from '../ui/MobileTable';
import SwapHistoryDialog from './SwapHistoryDialog';
import SwapProductDialog from './SwapProductDialog';


export interface ProductForLODetail {
    id: number;
    name: string;
    unitPrice: string;
    taxApplied: boolean;
    salesOrderProduct: Array<{
        id: number;
        unitPrice: string;
        taxPercentage: number;
        loRemeasureLength?: number;
        loRemeasureWidth?: number;
        receivingAreaSqFt: number;
        inventoryProduct: {
            id: number;
            combinedNumber: string;
            isSlabType: boolean;
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
        swapHistories?: any[];
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

export interface ProductsTableForLODetailProps {
    products: ProductForLODetail[];
    taxLabel: string;
    canSwap?: boolean;
    onRefresh?: () => void;
}


interface ProductRow {
    id: number;
    sn: number;
    productName: string;
    description: string;
    unitPrice: number;
    totalReceivingQty: number;
    totalRemeasureQty: number;
    totalAmount: number;
    tax: string;
    inventoryItems: InventoryItem[];
}

interface InventoryItem {
    serialNo: string;
    barcode: string;
    blockBundle: string;
    slabNo: string;
    location: string;
    quantity: string;
    slabRemeasureQty: string;
    salesOrderProductId: number;
    historyCount: number;
    productName: string;
    productType: string;
    productId: number;
}


const ProductsTableForLODetail: React.FC<ProductsTableForLODetailProps> = ({
    products,
    taxLabel,
    canSwap,
    onRefresh,
}) => {

    const tokens = getTokens();
    const theme = useTheme();
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    const [showHistory, setShowHistory] = useState(false);
    const [selectedSop, setSelectedSop] = useState<{ id: number, name: string, type: string } | null>(null);

    // Swap State
    const [showSwapDialog, setShowSwapDialog] = useState(false);
    const [selectedSopId, setSelectedSopId] = useState<number | null>(null);
    const [currentProductId, setCurrentProductId] = useState<number | null>(null);

    const handleSwapClick = (sopId: number, prodId: number) => {
        setSelectedSopId(sopId);
        setCurrentProductId(prodId);
        setShowSwapDialog(true);
    };

    const handleHistoryClick = (id: number, name: string, type: string) => {

        setSelectedSop({ id, name, type });
        setShowHistory(true);
    };

    // Transform products data
    const productRows: ProductRow[] = products.map((product, index) => {
        const unitPrice = parseFloat(product.unitPrice || '0');
        let totalReceivingQty = 0;
        let totalRemeasureQty = 0;
        let totalAmount = 0;

        const inventoryItems: InventoryItem[] = product.salesOrderProduct.map(sop => {
            const receivingQty = sop.receivingAreaSqFt;
            const remeasureLength = sop.loRemeasureLength ?? sop.inventoryProduct.slab.receivingLength;
            const remeasureWidth = sop.loRemeasureWidth ?? sop.inventoryProduct.slab.receivingWidth;
            const remeasureQty = (remeasureLength * remeasureWidth) / 144;

            totalReceivingQty += receivingQty;
            totalRemeasureQty += remeasureQty;
            totalAmount += remeasureQty * unitPrice;

            return {
                serialNo: sop.inventoryProduct.combinedNumber,
                barcode: sop.inventoryProduct.slab.barcode,
                blockBundle: `${sop.inventoryProduct.slab.block}-${sop.inventoryProduct.slab.lot}`,
                slabNo: sop.inventoryProduct.slab.slabNumber.toString(),
                location: sop.inventoryProduct.bin.name,
                quantity: `${sop.inventoryProduct.slab.receivingLength}×${sop.inventoryProduct.slab.receivingWidth} = ${receivingQty.toFixed(2)} SF`,
                slabRemeasureQty: `${remeasureLength}×${remeasureWidth} = ${remeasureQty.toFixed(2)} SF`,
                salesOrderProductId: sop.id,
                historyCount: sop.swapHistories?.length || 0,
                productName: product.name,
                productType: sop.inventoryProduct.isSlabType ? 'Slab' : 'Piece',
                productId: product.id,
            };

        });

        // Get tax percentage from first salesOrderProduct
        const taxPercentage = product.salesOrderProduct[0]?.taxPercentage || 0;
        const hasTax = product.taxApplied && taxPercentage > 0;

        return {
            id: product.id,
            sn: index + 1,
            productName: product.name,
            description: '--',
            unitPrice,
            totalReceivingQty,
            totalRemeasureQty,
            totalAmount,
            tax: hasTax ? taxLabel : '--',
            inventoryItems,
        };
    });

    const columns: Column<ProductRow>[] = [
        {
            id: 'sn',
            label: 'SN',
            accessorKey: 'sn',
            align: 'center',
            width: 60,
        },
        {
            id: 'product',
            label: 'Product(SKU)',
            accessorKey: 'productName',
            render: (value) => (
                <BodyText color={theme.textPrimary?.val} style={{ fontWeight: '500' }}>
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
            id: 'totalReceivingQty',
            label: 'Total Receiving Qty',
            accessorKey: 'totalReceivingQty',
            align: 'right',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${value.toFixed(2)}SF` : value}</BodyText>
            ),
        },
        {
            id: 'totalRemeasureQty',
            label: 'Total Remeasure Qty',
            accessorKey: 'totalRemeasureQty',
            align: 'right',
            render: (value) => (
                <BodyText>{typeof value === 'number' ? `${value.toFixed(2)} SF` : value}</BodyText>
            ),
        },
        {
            id: 'totalAmount',
            label: 'Total Amount',
            accessorKey: 'totalAmount',
            align: 'right',
            type: 'money',
        },
        {
            id: 'tax',
            label: 'Tax',
            accessorKey: 'tax',
            render: (value) => <BodyText>{value || '--'}</BodyText>,
        },
    ];

    const inventoryColumns: Column<InventoryItem>[] = [
        {
            id: 'serialNo',
            label: 'Serial Num',
            accessorKey: 'serialNo',
            width: 100,
        },
        {
            id: 'barcode',
            label: 'Barcode',
            accessorKey: 'barcode',
            width: 120,
        },
        {
            id: 'blockBundle',
            label: 'Block-Bundle',
            accessorKey: 'blockBundle',
            width: 120,
        },
        {
            id: 'slabNo',
            label: 'Slab Num',
            accessorKey: 'slabNo',
            width: 100,
        },
        {
            id: 'location',
            label: 'Location(Bin)',
            accessorKey: 'location',
            width: 120,
        },
        {
            id: 'quantity',
            label: 'Quantity',
            accessorKey: 'quantity',
            width: 150,
        },
        {
            id: 'slabRemeasureQty',
            label: 'Slab Remeasure(L×W) Qty',
            accessorKey: 'slabRemeasureQty',
            width: 180,
        },
        {
            id: 'actions',
            label: 'Actions',
            width: 100,
            render: (_value, row) => {
                return (
                    <XStack gap={tokens.space[2].val}>
                        {canSwap && (
                            <Button
                                title=""
                                variant="outline"
                                size="small"
                                onPress={() => handleSwapClick(row.salesOrderProductId, row.productId)}
                                icon={<ArrowRightLeft size={16} color={theme.primary?.val || '#0891B2'} />}
                            />
                        )}

                        {row.historyCount > 0 && (
                            <Button
                                variant="outline"
                                size="small"
                                onPress={() => handleHistoryClick(row.salesOrderProductId, row.productName, row.productType)}
                                icon={<History size={16} color={theme.orange8?.val} />}
                                title={row.historyCount.toString()}
                                color={theme.orange8?.val}
                            />
                        )}
                        {!canSwap && row.historyCount === 0 && <BodyText>--</BodyText>}
                    </XStack>
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
                                borderLeftColor={theme.blue8?.val}
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
            {selectedSop && (
                <SwapHistoryDialog
                    open={showHistory}
                    onOpenChange={setShowHistory}
                    salesOrderProductId={selectedSop.id}
                    productName={selectedSop.name}
                    productType={selectedSop.type}
                />
            )}
            <SwapProductDialog
                open={showSwapDialog}
                onOpenChange={setShowSwapDialog}
                salesOrderProductId={selectedSopId}
                productId={currentProductId}
                onSuccess={onRefresh || (() => { })}
            />
        </CardWithHeader>
    );
};


export default ProductsTableForLODetail;
