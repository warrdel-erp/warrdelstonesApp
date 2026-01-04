import { Printer, FileText, Package } from '@tamagui/lucide-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { getTokens, useTheme, XStack, YStack } from 'tamagui';
import moment from 'moment';
import { BodyText, Button } from '../ui';
import CardWithHeader from '../ui/CardWithHeader';
import { Badge } from '../ui/Badge';
import DetailGridRenderer from '../ui/DetailGridRenderer';
import ActionMenu, { ActionMenuItem } from '../ui/ActionMenu';
import { MoreVertical } from '@tamagui/lucide-icons';
import { EmptyList } from '../ui/EmptyList';

export interface LoadingOrderRow {
    id: number;
    code: string;
    date?: string;
    createdAt?: string;
    stage?: string;
    finalTotal?: number;
    totalProfit?: number;
    status?: number;
    packagingList?: {
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
    onAddLoadingOrder?: () => void;
    onPrint?: (loadingOrderId: number) => void;
    onCreatePackaging?: (loadingOrderId: number) => void;
    onCreateInvoice?: (loadingOrderId: number) => void;
    onLoadingOrderClick?: (loadingOrderId: number) => void;
}

const LoadingOrdersTable: React.FC<LoadingOrdersTableProps> = ({
    loadingOrders,
    onAddLoadingOrder,
    onPrint,
    onCreatePackaging,
    onCreateInvoice,
    onLoadingOrderClick,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const formatCurrency = (value: number) => {
        return `$${value.toFixed(2)}`;
    };

    const renderLoadingOrderCard = (item: ListRenderItemInfo<LoadingOrderRow>) => {
        const lo = item.item;
        const dateValue = lo.date || lo.createdAt;
        const formattedDate = dateValue ? moment(dateValue).format('YYYY-MM-DD') : '-';
        const profit = lo.totalProfit || 0;
        const statusPercentage = lo.status || 0;

        const actions: ActionMenuItem[] = [
            {
                label: 'Print',
                icon: Printer,
                onPress: () => onPrint?.(lo.id),
            },
            {
                label: 'Create Packaging',
                icon: Package,
                onPress: () => onCreatePackaging?.(lo.id),
            },
            {
                label: 'Create Invoice',
                icon: FileText,
                onPress: () => onCreateInvoice?.(lo.id),
            },
        ];

        const detailItems = [
            {
                label: 'Date',
                width: '47%',
                value: formattedDate,
            },
            {
                label: 'Loading Order',
                width: '47%',
                value: (
                    <Button
                        title={lo.code || '-'}
                        variant="outline"
                        size="small"
                        onPress={() => onLoadingOrderClick?.(lo.id)}
                    />
                ),
            },
            {
                label: 'Packaging List',
                width: '47%',
                value: lo.packagingList?.code || '-',
            },
            {
                label: 'Invoice',
                width: '47%',
                value: lo.invoice?.code || '-',
            },
            {
                label: 'Stage',
                width: '47%',
                value: lo.stage || 'Initiated',
            },
            {
                label: 'Final Total',
                width: '47%',
                value: formatCurrency(lo.finalTotal || 0),
                type: 'money' as const,
            },
            {
                label: 'Total Profit',
                width: '47%',
                value: (
                    <BodyText color={profit < 0 ? theme.red8?.val || '#EF4444' : theme.green8?.val || '#10B981'}>
                        {profit < 0 ? `-${formatCurrency(Math.abs(profit))}` : formatCurrency(profit)}
                    </BodyText>
                ),
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
                onAddLoadingOrder && (
                    <Button
                        title="Add Loading Order"
                        variant="outline"
                        size="small"
                        onPress={onAddLoadingOrder}
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
