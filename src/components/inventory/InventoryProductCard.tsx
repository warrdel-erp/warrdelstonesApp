import { Copy, Edit3, Info, Trash2 } from '@tamagui/lucide-icons';
import React from 'react';
import { ViewStyle } from 'react-native';
import { Text, XStack } from 'tamagui';
import theme from '../../theme';
import { FontConfig } from '../../theme/FontConfig';
import { InventoryProduct } from '../../types/InventoryTypes';
import { ActionMenuItem } from '../ui/ActionMenu';
import CardWithHeader from '../ui/CardWithHeader';
import DetailGridRenderer from '../ui/DetailGridRenderer';
import { StatusBadge } from '../ui/StatusBadge';

export interface InventoryProductCardProps {
    product: InventoryProduct & {
        slab?: {
            serialNumber?: number;
            slabNumber?: number;
            barcode?: string;
            block?: string;
            lot?: string;
            packagedSqrFt?: number;
            receivedSqrFt?: number;
            isHold?: boolean;
        };
        genericProduct?: {
            barcode?: string;
            isHold?: boolean;
        };
        landedUnitCost?: number;
    };
    isSelected: boolean;
    onSelectionChange: (productId: number) => void;
    showCheckbox?: boolean;
    style?: ViewStyle;
    index?: number;
}

export const InventoryProductCard: React.FC<InventoryProductCardProps> = ({
    product,
    isSelected,
    onSelectionChange,
    showCheckbox = true,
    style,
    index,
}) => {
    const slab = product.slab;
    const genericProduct = product.genericProduct;
    const onHand = slab?.receivedSqrFt || slab?.packagedSqrFt;
    const isOnHold = slab?.isHold || genericProduct?.isHold || false;
    const barcode = slab?.barcode || genericProduct?.barcode;

    const getStatusBadgeProps = (status: string) => {
        switch (status) {
            case 'INITIATE':
                return {
                    status: 'info' as const,
                    text: 'Initiate',
                    icon: 'PlayCircle',
                    variant: 'soft' as const,
                };
            case 'IN_INVENTORY':
                return {
                    status: 'success' as const,
                    text: 'In Inventory',
                    icon: 'Package',
                    variant: 'soft' as const,
                };
            case 'ALLOCATED':
                return {
                    status: 'warning' as const,
                    text: 'Allocated',
                    icon: 'FileText',
                    variant: 'soft' as const,
                };
            case 'SOLD':
                return {
                    status: 'error' as const,
                    text: 'Sold',
                    icon: 'CheckCircle2',
                    variant: 'soft' as const,
                };
            default:
                return {
                    status: 'neutral' as const,
                    text: status,
                    icon: 'Info',
                    variant: 'soft' as const,
                };
        }
    };

    // Card badges
    const cardBadges = [
        { label: index !== undefined ? String(index + 1) : '-' },
        { label: product.isSlabType ? 'Slab' : 'Generic' },
    ];

    // Card title
    const cardTitle = (
        <XStack alignItems="center" flexWrap="wrap">
            <Text
                fontSize={theme.typography.fontSize.base}
                fontWeight="bold"
                color="#1F2937"
                style={{ fontFamily: FontConfig.Bold }}>
                {product.combinedNumber}
            </Text>
            <Text
                fontSize={theme.typography.fontSize.base}
                fontWeight="normal"
                color="#9CA3AF"
                style={{ fontFamily: FontConfig.Regular }}>
                {' '}| {product.bin.name} | {product.bin.warehouse.location.location}
            </Text>
        </XStack>
    );

    // Card actions menu items
    const cardActions: ActionMenuItem[] = [
        {
            label: 'View Details',
            icon: Info,
            onPress: () => {
                console.log(`View details for product ${product.id}`);
            },
        },
        {
            label: 'Edit',
            icon: Edit3,
            onPress: () => {
                console.log(`Edit product ${product.id}`);
            },
        },
        {
            label: 'Duplicate',
            icon: Copy,
            onPress: () => {
                console.log(`Duplicate product ${product.id}`);
            },
        },
        {
            label: 'Delete',
            icon: Trash2,
            iconColor: theme.colors.status.error,
            destructive: true,
            onPress: () => {
                console.log(`Delete product ${product.id}`);
            },
        },
    ];

    // Data grid items
    const dataGridItems = [
        {
            label: 'BL-BN-SN',
            value: `${slab?.block || '-'}-${slab?.lot || '-'}-${slab?.slabNumber || '-'}`,
            width: '30%',
        },
        {
            label: 'Barcode',
            value: barcode || '-',
            valueStyle: { color: '#111827' },
            width: '30%',
        },
        {
            label: 'On Hand',
            value: onHand ? `${onHand.toFixed(2)} sqft` : 'N/A',
            valueStyle: {
                color: '#06B6D4',
                fontFamily: FontConfig.SemiBold,
                fontWeight: '600',
            },
            width: '30%',
        },
    ];

    // Financial row items
    const financialRowItems = [
        {
            label: 'Landed Cost',
            value: product.landedUnitCost,
            type: 'money' as const,
            valueStyle: { fontSize: theme.typography.fontSize.base },
            width: '30%',
        },
        {
            label: 'Selling Cost',
            value: product.sellingPrice,
            type: 'money' as const,
            valueStyle: { fontSize: theme.typography.fontSize.base },
            width: '30%',
        },
        {
            label: 'Status',
            value: <StatusBadge {...getStatusBadgeProps(product.status)} size="small" />,
            width: '30%',
        },
    ];

    return (
        <CardWithHeader
            badges={cardBadges}
            title={cardTitle}
            actions={cardActions}
            style={style}
            bodyGap={0}>

            {/* Data Grid - Clean Layout */}
            <DetailGridRenderer
                items={dataGridItems}
                justifyContent="space-between"
                gap={theme.spacing.md}
                containerProps={{
                    marginBottom: theme.spacing.lg,
                    paddingBottom: theme.spacing.lg,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                }}
            />

            {/* Financial Row */}
            <DetailGridRenderer
                items={financialRowItems}
                gap={theme.spacing.md}
            />
        </CardWithHeader>
    );
};

export default InventoryProductCard;
