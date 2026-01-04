import { Trash2 } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import { BodyText, Button } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import MobileTable, { Column } from '../ui/MobileTable';

export interface ProductRow {
    id: number;
    productName: string;
    sku?: string;
    description?: string;
    units: string;
    qty: number;
    pricePerUnit: number;
    total: number;
    tax: boolean;
    inventoryItems?: InventoryItem[];
}

export interface InventoryItem {
    serialNo: string;
    barcode: string;
    blockBundle: string;
    slabNo: string;
    location: string;
    qtySf: string;
    subTrx?: string;
    productId?: number;
}

export interface ProductsTableProps {
    products: ProductRow[];
    onAddProduct?: () => void;
    onDeleteItem?: (productId: number, inventoryItemId?: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({
    products,
    onAddProduct,
    onDeleteItem,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    const columns: Column<ProductRow>[] = [
        {
            id: 'product',
            label: 'Product(SKU)',
            accessorKey: 'productName',
            render: (value, row) => (
                <BodyText color={theme.blue8?.val || '#3B82F6'} style={{ fontWeight: '500' }}>
                    {value || row.sku || '-'}
                </BodyText>
            ),
        },
        {
            id: 'description',
            label: 'Description',
            accessorKey: 'description',
            render: (value) => <BodyText>{value || '-'}</BodyText>,
        },
        {
            id: 'units',
            label: 'Units',
            accessorKey: 'units',
            align: 'center',
        },
        {
            id: 'qty',
            label: 'Qty',
            accessorKey: 'qty',
            align: 'center',
            type: 'number',
        },
        {
            id: 'pricePerUnit',
            label: 'Price/Unit',
            accessorKey: 'pricePerUnit',
            align: 'right',
            type: 'money',
        },
        {
            id: 'total',
            label: 'Total',
            accessorKey: 'total',
            align: 'right',
            type: 'money',
        },
        {
            id: 'tax',
            label: 'Tax',
            accessorKey: 'tax',
            align: 'center',
            render: (value) => (
                <XStack justifyContent="center">
                    <YStack
                        backgroundColor={value ? theme.blue8?.val || '#3B82F6' : theme.gray5?.val || '#E5E7EB'}
                        width={40}
                        height={24}
                        borderRadius={12}
                        justifyContent="center"
                        alignItems="center">
                        <YStack
                            backgroundColor={theme.background?.val || '#FFFFFF'}
                            width={20}
                            height={20}
                            borderRadius={10}
                            position="absolute"
                            left={value ? 18 : 2}
                        />
                    </YStack>
                </XStack>
            ),
        },
    ];

    const inventoryColumns: Column<InventoryItem>[] = [
        {
            id: 'serialNo',
            label: 'Serial No',
            accessorKey: 'serialNo',
        },
        {
            id: 'barcode',
            label: 'Barcode',
            accessorKey: 'barcode',
        },
        {
            id: 'blockBundle',
            label: 'Block-Bundle',
            accessorKey: 'blockBundle',
        },
        {
            id: 'slabNo',
            label: 'Slab No',
            accessorKey: 'slabNo',
        },
        {
            id: 'location',
            label: 'Location(Bin)',
            accessorKey: 'location',
        },
        {
            id: 'qtySf',
            label: 'Qty(SF)',
            accessorKey: 'qtySf',
        },
        {
            id: 'subTrx',
            label: 'Sub-Trx',
            accessorKey: 'subTrx',
            render: (value) => <BodyText>{value || '-'}</BodyText>,
        },
        {
            id: 'actions',
            label: 'Actions',
            type: 'actions',
            render: (value, row: InventoryItem) => (
                <TouchableOpacity
                    onPress={() => onDeleteItem?.(row.productId || 0, row.serialNo)}
                    style={{ padding: tokens.space[2].val }}>
                    <Trash2 size={18} color={theme.red8?.val || '#EF4444'} />
                </TouchableOpacity>
            ),
        },
    ];

    return (
        <CardWithHeader
            title="Products"
            customActions={
                onAddProduct && (
                    <Button
                        title="Add Product"
                        variant="outline"
                        size="small"
                        onPress={onAddProduct}
                        style={{ marginRight: tokens.space[2].val }}
                    />
                )
            }>
            <MobileTable
                columns={columns as Column<Record<string, any>>[]}
                data={products as Record<string, any>[]}
                emptyMessage="No products added"
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

export default ProductsTable;

