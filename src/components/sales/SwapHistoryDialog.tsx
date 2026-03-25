import { History } from '@tamagui/lucide-icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import { services } from '../../network';
import { showErrorToast } from '../../utils';
import { BodyText, Button, Heading } from '../ui';
import AppDialog from '../ui/AppDialog';
import DetailGridRenderer from '../ui/DetailGridRenderer';
import MobileTable, { Column } from '../ui/MobileTable';
import { ScreenLoadingIndicator } from '../ui/ScreenLoadingIndicator';

export interface SwapHistoryItem {
    id: number;
    loRemeasureLength: number | null;
    loRemeasureWidth: number | null;
    plRemeasureLength: number | null;
    plRemeasureWidth: number | null;
    stage: string;
    inventoryProductId: number;
    salesProductId: number;
    createdAt: string;
    updatedAt: string;
    inventoryProduct: {
        id: number;
        combinedNumber: string;
        isSlabType: boolean;
        product: {
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
            receivedSqrFt: number;
        } | null;
    };
}

export interface SwapHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    salesOrderProductId: number | null;
    productName: string;
    productType: string;
}

const SwapHistoryDialog: React.FC<SwapHistoryDialogProps> = ({
    open,
    onOpenChange,
    salesOrderProductId,
    productName,
    productType,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState<SwapHistoryItem[]>([]);

    useEffect(() => {
        if (open && salesOrderProductId) {
            fetchHistory();
        } else if (!open) {
            setHistoryData([]);
        }
    }, [open, salesOrderProductId]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Using the endpoint provided by user, assuming it takes the sop ID
            const response = await services.sales.getSwapHistory(salesOrderProductId!);
            if (response.success && response.data?.data) {
                setHistoryData(response.data.data);
            } else {
                showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch swap history');
            }
        } catch (error) {
            showErrorToast('Failed to fetch swap history');
        } finally {
            setLoading(false);
        }
    };

    const columns: Column<SwapHistoryItem>[] = [
        {
            id: 'serialNo',
            label: 'Serial No.',
            accessorKey: 'inventoryProduct.combinedNumber',
            width: 100,
        },
        {
            id: 'blockLotSlab',
            label: 'Block-Lot-Slab',
            render: (_value, row) => {
                const slab = row.inventoryProduct.slab;
                if (!slab) return '--';
                return `${slab.block}-${slab.lot}-${slab.slabNumber}`;
            },
            width: 140,
        },
        {
            id: 'barcode',
            label: 'Barcode',
            accessorKey: 'inventoryProduct.slab.barcode',
            width: 120,
        },
        {
            id: 'swappedAt',
            label: 'Swapped At',
            render: (_value, row) => (
                <YStack>
                    <BodyText style={{ fontWeight: '500' }}>{dayjs(row.updatedAt).format('DD-MM-YYYY')}</BodyText>
                    <BodyText style={{ color: theme.orange10?.val, fontSize: 12 }}>{dayjs(row.updatedAt).format('HH:mm:ss')}</BodyText>
                </YStack>
            ),
            width: 120,
        },
        {
            id: 'stage',
            label: 'Stage',
            render: (value) => (
                <YStack backgroundColor={theme.gray2?.val} paddingHorizontal={10} paddingVertical={4} borderRadius={20} alignSelf="flex-start">
                    <BodyText style={{ fontSize: 12, color: theme.gray11?.val }}>{value || 'Sale Order'}</BodyText>
                </YStack>
            ),
            width: 100,
            accessorKey: 'stage',
        },
        {
            id: 'loRemeasure',
            label: 'LO Remeasure (L*W = SF)',
            render: (_value, row) => {
                if (row.loRemeasureLength && row.loRemeasureWidth) {
                    const sf = (row.loRemeasureLength * row.loRemeasureWidth) / 144;
                    return `${row.loRemeasureLength}*${row.loRemeasureWidth} = ${sf.toFixed(2)} SF`;
                }
                return '--';
            },
            width: 180,
        },
        {
            id: 'plRemeasure',
            label: 'PL Remeasure (L*W = SF)',
            render: (_value, row) => {
                if (row.plRemeasureLength && row.plRemeasureWidth) {
                    const sf = (row.plRemeasureLength * row.plRemeasureWidth) / 144;
                    return `${row.plRemeasureLength}*${row.plRemeasureWidth} = ${sf.toFixed(2)} SF`;
                }
                return '--';
            },
            width: 180,
        },
    ];

    const header = (
        <XStack gap={tokens.space[3].val} alignItems="center">
            <YStack backgroundColor={theme.blue2?.val} padding={tokens.space[2].val} borderRadius={tokens.radius[2].val}>
                <History size={24} color={theme.blue8?.val} />
            </YStack>
            <YStack>
                <Heading level={4} color={theme.textPrimary?.val}>Swap History</Heading>
                <BodyText color={theme.textSecondary?.val}>Track all swaps for this item</BodyText>
            </YStack>
        </XStack>
    );

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            header={header}
            width={1000}
            maxWidth="95%"
            footer={
                <Button
                    title="Close"
                    variant="outline"
                    onPress={() => onOpenChange(false)}
                />
            }
        >
            <YStack gap={tokens.space[4].val}>
                {/* Summary Row */}
                <DetailGridRenderer
                    items={[
                        {
                            label: 'Product',
                            value: productName,
                            valueStyle: { fontWeight: '600' },
                            width: "38%"
                        },
                        {
                            label: 'Type',
                            value: productType,
                            valueStyle: { fontWeight: '600' },
                            width: "25%"

                        },
                        {
                            label: 'Records',
                            value: historyData.length.toString(),
                            valueStyle: { fontWeight: '600' },
                            width: "25%"

                        },
                    ]}
                    gap={tokens.space[4].val}
                    containerProps={{
                        padding: tokens.space[3].val,
                        borderWidth: 1,
                        borderColor: theme.gray5?.val,
                        borderRadius: tokens.radius[2].val,
                    }}
                />

                {loading ? (
                    <ScreenLoadingIndicator title="Loading History..." />
                ) : (
                    <MobileTable
                        columns={columns as Column<Record<string, any>>[]}
                        data={historyData as any}
                        emptyMessage="No swap history available."
                        isChild={false}
                    />
                )}
            </YStack>
        </AppDialog>
    );
};

export default SwapHistoryDialog;
