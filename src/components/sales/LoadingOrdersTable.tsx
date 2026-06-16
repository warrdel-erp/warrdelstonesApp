import { FileText, Package, Printer } from '@tamagui/lucide-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { YStack, getTokens, useTheme } from 'tamagui';
import { BodyText, Button } from '../ui';
import { ActionMenuItem } from '../ui/ActionMenu';
import { Badge } from '../ui/Badge';
import CardWithHeader from '../ui/CardWithHeader';
import DetailGridRenderer from '../ui/DetailGridRenderer';
import { EmptyList } from '../ui/EmptyList';

export interface LoadingOrderRow {
    id: number;
    code: string;
    date?: string;
    createdAt?: string;
    stage?: string;
    loDate?: string;
    finalTotal?: number;
    totalProfit?: number;
    status?: number;
    loadingOrder?: {
        id: number;
        code: string;
    } | null;
    invoice?: {
        id: number;
        code: string;
    } | null;
}

export interface LoadingOrdersTableProps {
    loadingOrders: LoadingOrderRow[];
    onAddPackagingList?: () => void;
    onPrint?: (loadingOrderId: number) => void;
    onCreateLoadingOrder?: (packagingListId: number) => void;
    onCreateInvoice?: (loadingOrderId: number) => void;
    onLoadingOrderClick?: (loadingOrderId: number) => void;
    onPackagingListClick?: (packagingListId: number) => void;
    onInvoiceClick?: (loadingOrderId: number) => void;
}

const LoadingOrdersTable: React.FC<LoadingOrdersTableProps> = ({
    loadingOrders,
    onAddPackagingList,
    onPrint,
    onCreateLoadingOrder,
    onCreateInvoice,
    onLoadingOrderClick,
    onPackagingListClick,
    onInvoiceClick,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const formatCurrency = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    const renderLoadingOrderCard = (item: ListRenderItemInfo<LoadingOrderRow>) => {

        const lo = item.item;

        // const profit = decimalSubtract(Number(row?.calculations?.final?.total), Number(row?.calculations?.receiving?.total))
        const statusPercentage = lo.status || 0;

        const actions: ActionMenuItem[] = [
            {
                label: 'View PL',
                icon: Package,
                onPress: () => onPackagingListClick?.(lo.id),
            },
            {
                label: 'Print',
                icon: Printer,
                onPress: () => onPrint?.(lo.id),
            },
        ];

        // Add conditional actions if LO or Invoice exists
        if (lo.loadingOrder) {
            actions.push({
                label: 'View LO',
                icon: FileText,
                onPress: () => onLoadingOrderClick?.(lo.loadingOrder!.id),
            });
        }

        if (lo.invoice) {
            actions.push({
                label: 'View Invoice',
                icon: FileText,
                onPress: () => onInvoiceClick?.(lo.loadingOrder!.id),
            });
        }

        // Add create actions only if they don't exist
        if (!lo.loadingOrder) {
            actions.push({
                label: 'Create Loading',
                icon: FileText,
                onPress: () => onCreateLoadingOrder?.(lo.id),
            });
        }

        if (lo.loadingOrder && !lo.invoice) {
            actions.push({
                label: 'Create Invoice',
                icon: FileText,
                onPress: () => onCreateInvoice?.(lo.loadingOrder!.id),
            });
        }


        const detailItems = [
            {
                label: 'Loading Order',
                width: '47%',
                value: lo.loadingOrder?.code || '-',
            },
            {
                label: 'Invoice',
                width: '47%',
                value: lo.invoice?.code || '-',
            },
            {
                label: 'Date',
                width: '47%',
                value: lo.loDate,
            },
            {
                label: 'Stage',
                width: '47%',
                value: lo.stage || 'Initiated',
            },
            {
                label: 'Final Total',
                width: '47%',
                value: lo.finalTotal || 0.00,
                type: 'money' as const,
            },
            {
                label: 'Total Profit',
                width: '47%',
                value: lo.totalProfit || 0.00,
            },
            {
                label: 'Status',
                width: '47%',
                value: (
                    <Badge

                        label={`${statusPercentage}%`}

                        size="small"
                    />
                ),
            },
        ];

        return (
            <CardWithHeader
                title={lo.code}
                actions={actions}>
                <DetailGridRenderer items={detailItems} gap={tokens.space[3].val} />
            </CardWithHeader>
        );
    };

    const ItemSeparator = () => <View style={{ height: tokens.space[2].val }} />;

    return (
        <CardWithHeader
            title="Invoice / PL / LO"
            customActions={
                (
                    <Button
                        title="Add PL"
                        variant="outline"
                        size="small"
                        onPress={onAddPackagingList}
                        style={{ marginRight: tokens.space[2].val }}
                    />
                )
            }>
            {loadingOrders.length === 0 ? (
                <YStack
                    padding={tokens.space[6].val}
                    alignItems="center"
                    justifyContent="center"
                    gap={tokens.space[2].val}>
                    <BodyText color={theme.textSecondary?.val || '#6B7280'}>
                        Add at least one loading order to create an invoice
                    </BodyText>
                </YStack>
            ) : (
                <FlatList
                    data={loadingOrders}
                    renderItem={renderLoadingOrderCard}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={ItemSeparator}
                    scrollEnabled={false}
                    ListEmptyComponent={() => <EmptyList />}
                />
            )}
        </CardWithHeader>
    );
};

export default LoadingOrdersTable;
