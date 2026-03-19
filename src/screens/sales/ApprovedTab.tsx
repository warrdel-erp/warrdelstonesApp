import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { Text, XStack, getTokens, useTheme } from 'tamagui';
import { StatusBadge } from '../../components/ui';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { services } from '../../network';
import { showErrorToast } from '../../utils';
import { DeliveryRoutePopup } from './DeliveryRoutePopup';

export const ApprovedTab: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [filter, setFilter] = React.useState({
        status: 'approved' as const,
    });

    const [deliveries, setDeliveries] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedDelivery, setSelectedDelivery] = React.useState<any>(null);
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    React.useEffect(() => {
        if (isActive) {
            console.log('ApprovedTab active, fetching...');
            fetchDeliveries();
        }
    }, [isActive, filter]);

    useFocusEffect(
        React.useCallback(() => {
            if (isActive) {
                fetchDeliveries();
            }
            return () => { };
        }, [filter, isActive]),
    );

    const fetchDeliveries = async () => {
        setLoading(true);
        const response = await services.sales.getDeliveries(filter);
        if (response.success) {
            setDeliveries(response.data?.data || []);
        } else {
            showErrorToast(response.error?.message[0] ?? 'Failed to fetch deliveries');
        }
        setLoading(false);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { status: 'success' | 'warning' | 'error' | 'info'; text: string }> = {
            pending: { status: 'warning', text: 'Pending' },
            approved: { status: 'success', text: 'Approved' },
            completed: { status: 'success', text: 'Completed' },
            rejected: { status: 'error', text: 'Rejected' },
        };
        return statusMap[status.toLowerCase()] || { status: 'info', text: status };
    };

    const ItemSeparator = () => <View style={{ height: tokens.space[2].val }} />;

    const renderDeliveryItem = (listItem: ListRenderItemInfo<any>) => {
        const item = listItem.item;
        const serialNumber = listItem.index + 1;
        const statusProps = getStatusBadge(item.status);

        // Extract loading order codes
        const loadingOrderCodes = item.invoiceDeliveries
            ?.map((id: any) => id.loadingOrder?.code)
            .filter(Boolean)
            .join(', ') || 'N/A';

        const detailItems = [
            {
                label: 'Truck',
                value: `${item.truck?.name || 'N/A'}\n${item.truck?.registrationNumber || ''}`,
                width: '45%',
            },
            {
                label: 'Loading Orders',
                value: loadingOrderCodes,
                width: '45%',
            },
            {
                label: 'Date',
                value: `${moment(item.createdAt).format('DD-MM-YYYY')}\n${moment(item.createdAt).format('HH:mm:ss')}`,
                width: '45%',
            },
        ];

        return (
            <TouchableOpacity
                key={item.id.toString()}
                onPress={() => {
                    // Navigate to delivery detail if exists
                }}
                activeOpacity={0.9}
            >
                <CardWithHeader
                    subheading={`S.No: ${serialNumber}`}
                    title={
                        <XStack alignItems="center" gap="$2">
                            <Text fontWeight="bold" fontSize="$5" color={theme.textPrimary?.val}>
                                {item.truck?.name || `Delivery #${item.id}`}
                            </Text>
                            <StatusBadge {...statusProps} variant="soft" size="small" />
                        </XStack>
                    }
                    actions={[{
                        label: 'SHOW DELIVERY',
                        onPress: () => {
                            setSelectedDelivery(item);
                            setIsPopupOpen(true);
                        },
                    }]}
                >
                    <DetailGridRenderer items={detailItems} gap={tokens.space[3].val} />
                </CardWithHeader>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundSecondary?.val }}>
            {loading ? (
                <ScreenLoadingIndicator title={'Loading Deliveries...'} />
            ) : (
                <FlatList
                    data={deliveries}
                    renderItem={renderDeliveryItem}
                    contentContainerStyle={{ padding: tokens.space[2].val }}
                    ItemSeparatorComponent={ItemSeparator}
                    keyExtractor={item => item.id.toString()}
                    ListEmptyComponent={() => <EmptyList />}
                />
            )}
            <DeliveryRoutePopup
                open={isPopupOpen}
                onOpenChange={setIsPopupOpen}
                delivery={selectedDelivery}
                onUpdate={fetchDeliveries}
            />
        </View>
    );
};
