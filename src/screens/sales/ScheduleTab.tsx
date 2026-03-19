import { useFocusEffect } from '@react-navigation/native';
import { Truck } from '@tamagui/lucide-icons';
import moment from 'moment';
import React from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { Text, XStack, getTokens, useTheme } from 'tamagui';
import { TruckSelectionDialog } from '../../components/sales/TruckSelectionDialog';
import { Button, CheckBox, FloatingActionButton, StatusBadge } from '../../components/ui';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService';
import { ScreenId } from '../../navigation/navigationConstants';
import { services } from '../../network';
import { showErrorToast, showSuccessToast } from '../../utils';

export const ScheduleTab: React.FC<{ isActive?: boolean }> = ({ isActive }) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [filter, setFilter] = React.useState({
        page: 1,
        limit: 10,
    });

    const [deliveries, setDeliveries] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Initiation mode state
    const [isInitiating, setIsInitiating] = React.useState(false);
    const [selectedTruck, setSelectedTruck] = React.useState<any>(null);
    const [selectedLOs, setSelectedLOs] = React.useState<number[]>([]);
    const [truckDialogVisible, setTruckDialogVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    React.useEffect(() => {
        console.log('ScheduleTab active, fetching...');
        fetchDeliveries();
    }, [filter]);

    useFocusEffect(
        React.useCallback(() => {
            fetchDeliveries();
        }, [filter, isActive]),
    );

    const fetchDeliveries = async () => {
        setLoading(true);
        const response = await services.sales.getLoadingOrders(filter);
        if (response.success) {
            setDeliveries(response.data?.data || []);
        } else {
            showErrorToast(response.error?.message[0] ?? 'Failed to fetch deliveries');
        }
        setLoading(false);
    };

    const handleInitiate = () => {
        setTruckDialogVisible(true);
    };

    const onTruckSelect = (truck: any) => {
        setSelectedTruck(truck);
        setTruckDialogVisible(false);
        setIsInitiating(true);
        setSelectedLOs([]);
    };

    const handleConfirm = async () => {
        if (selectedLOs.length === 0) {
            showErrorToast('Please select at least one loading order');
            return;
        }
        setConfirmLoading(true);
        const response = await services.sales.initiateDelivery({
            loadingOrderIds: selectedLOs,
            truckId: selectedTruck.id,
        });
        if (response.success) {
            showSuccessToast('Delivery initiated successfully');
            setIsInitiating(false);
            setSelectedTruck(null);
            setSelectedLOs([]);
            fetchDeliveries();
        } else {
            showErrorToast(response.error?.message[0] ?? 'Failed to initiate delivery');
        }
        setConfirmLoading(false);
    };

    const onLOSelect = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedLOs([...selectedLOs, id]);
        } else {
            setSelectedLOs(selectedLOs.filter(loId => loId !== id));
        }
    };

    const getStageBadge = (stage: string) => {
        const stageMap: Record<string, { status: 'success' | 'warning' | 'error' | 'info'; text: string }> = {
            completed: { status: 'success', text: 'Completed' },
            initiated: { status: 'info', text: 'Initiated' },
            invoiced: { status: 'success', text: 'Invoiced' },
            rejected: { status: 'error', text: 'Rejected' },
        };
        return stageMap[stage.toLowerCase()] || { status: 'info', text: stage };
    };

    const ItemSeparator = () => <View style={{ height: tokens.space[2].val }} />;

    const renderDeliveryItem = (listItem: ListRenderItemInfo<any>) => {
        const item = listItem.item;
        const serialNumber = listItem.index + 1;
        const stageProps = getStageBadge(item.stage);

        const detailItems = [
            {
                label: 'Customer',
                value: `${item.salesOrder?.customer?.name}\n${item.salesOrder?.customer?.primaryPhoneNumber}`,
                width: '45%',
            },
            {
                label: 'Products',
                value: `Qty: ${item.quantities?.loadingOrder?.toFixed(2)}SF\nSlabs: ${item.salesOrderProducts?.length}`,
                width: '45%',
            },
            {
                label: 'Date',
                value: `${moment(item.loDate).format('DD-MM-YYYY')}\n${moment(item.createdAt).format('HH:mm:ss')}`,
                width: '45%',
            },
            {
                label: 'Shipping Location',
                value: item.shippingAddress?.address || 'N/A',
                width: '45%',
            },
            {
                label: 'Type',
                value: item.deliveryType?.toUpperCase() || '-',
                width: '45%',
            },
            {
                label: 'Exp. Date',
                value: moment(item.expDeliveryDate).format('DD-MM-YYYY'),
                width: '45%',
            },
        ];

        return (
            <XStack alignItems="center" key={item.id.toString()}>
                {isInitiating && (
                    <View style={{ paddingRight: tokens.space[2].val }}>
                        <CheckBox
                            checked={selectedLOs.includes(item.id)}
                            onChange={(checked) => onLOSelect(item.id, checked)}
                            disabled={item.invoiceDeliveries?.length > 0}
                        />
                    </View>
                )}
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                        if (isInitiating) {
                            if (!item.invoiceDeliveries?.length) {
                                onLOSelect(item.id, !selectedLOs.includes(item.id));
                            }
                        } else {
                            NavigationService.navigate(ScreenId.LOADING_ORDER_DETAIL, { loadingOrderId: item.id });
                        }
                    }}
                    activeOpacity={0.9}
                >
                    <CardWithHeader
                        subheading={`S.No: ${serialNumber}`}
                        title={
                            <XStack alignItems="center" gap="$2">
                                <Text fontWeight="bold" fontSize="$5" color={theme.textPrimary?.val}>
                                    {item.code}
                                </Text>
                                <StatusBadge {...stageProps} variant="soft" size="small" />
                            </XStack>
                        }
                        actions={!isInitiating ? [{
                            label: 'View',
                            onPress: () => {
                                NavigationService.navigate(ScreenId.LOADING_ORDER_DETAIL, { loadingOrderId: item.id });
                            },
                        }] : []}
                    >
                        <DetailGridRenderer items={detailItems} gap={tokens.space[3].val} />
                    </CardWithHeader>
                </TouchableOpacity>
            </XStack>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundSecondary?.val }}>

            {loading ? (
                <ScreenLoadingIndicator title={'Loading Deliveries...'} />
            ) : (
                <>
                    <FlatList
                        data={deliveries}
                        renderItem={renderDeliveryItem}
                        contentContainerStyle={{ padding: tokens.space[2].val, paddingBottom: 100 }}
                        ItemSeparatorComponent={ItemSeparator}
                        keyExtractor={item => item.id.toString()}
                        ListEmptyComponent={() => <EmptyList />}
                    />
                    <View style={{
                        position: 'absolute',
                        bottom: tokens.space[4].val,
                        right: tokens.space[4].val,
                        zIndex: 10,
                    }}>
                        {!isInitiating ? (
                            <FloatingActionButton
                                icon={<Truck size={24} color="white" />}
                                onPress={handleInitiate}
                            />
                        ) : (
                            <XStack gap="$2" alignItems="center">
                                <Button
                                    title="Cancel"
                                    onPress={() => {
                                        setIsInitiating(false);
                                        setSelectedTruck(null);
                                        setSelectedLOs([]);
                                    }}
                                    variant="outline"
                                    style={{ backgroundColor: 'white' }}
                                />
                                <Button
                                    title="Confirm"
                                    onPress={handleConfirm}
                                    variant="primary"
                                    loading={confirmLoading}
                                />
                            </XStack>
                        )}
                    </View>
                </>
            )}

            <TruckSelectionDialog
                open={truckDialogVisible}
                onOpenChange={setTruckDialogVisible}
                onTruckSelect={onTruckSelect}
            />
        </View>
    );
};
