import { ChevronDown, ChevronUp, Map as MapIcon } from '@tamagui/lucide-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
    Circle,
    H4,
    Separator,
    Text,
    View,
    XStack,
    YStack,
    useTheme
} from 'tamagui';
import { AppDialog } from '../../components/ui/AppDialog';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { services } from '../../network';
import { showErrorToast, showSuccessToast } from '../../utils';
import { DeliveryRouteMap } from './DeliveryRouteMap';

interface Stop {
    lat: number;
    lng: number;
    label: string;
    type?: 'PICK UP' | 'DELIVERY' | 'RETURN';
    invoiceDeliveryId?: number;
}

interface DeliveryRoutePopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    delivery: any;
    onUpdate?: () => void;
}

export const DeliveryRoutePopup: React.FC<DeliveryRoutePopupProps> = ({
    open,
    onOpenChange,
    delivery,
    onUpdate,
}) => {
    const theme = useTheme();
    const [stops, setStops] = useState<Stop[]>([]);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

    const deliveryStatus = delivery?.status || 'pending';
    const isDeliveryApproved = deliveryStatus === 'approved';
    const isDeliveryPending = deliveryStatus === 'pending';
    const isDeliveryCompleted = deliveryStatus === 'completed';
    const isDeliveryRejected = deliveryStatus === 'rejected';
    const isDeliveryLocked = isDeliveryApproved || isDeliveryCompleted || isDeliveryRejected;

    useEffect(() => {
        if (!delivery || !delivery.invoiceDeliveries) return;

        const newStops: Stop[] = [];
        const pickupStops = new Set<string>();

        const sortedDeliveries = [...delivery.invoiceDeliveries].sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            return 0;
        });

        sortedDeliveries.forEach((id: any) => {
            const pickupKey = `${id.fromLat}-${id.fromLng}`;
            if (!pickupStops.has(pickupKey)) {
                pickupStops.add(pickupKey);
                newStops.push({
                    lat: parseFloat(id.fromLat),
                    lng: parseFloat(id.fromLng),
                    label: id.fromAddress || 'Pickup Location',
                    type: 'PICK UP',
                });
            }

            newStops.push({
                lat: parseFloat(id.toLat),
                lng: parseFloat(id.toLng),
                label: id.toAddress || 'Delivery Location',
                type: 'DELIVERY',
                invoiceDeliveryId: id.id,
            });
        });
        setStops(newStops);
    }, [delivery]);

    const handleApprove = async () => {
        setIsApproving(true);
        const invoiceDeliveries = stops
            .map((stop, index) => {
                if (stop.type === 'DELIVERY' && stop.invoiceDeliveryId) {
                    return { id: stop.invoiceDeliveryId, order: index };
                }
                return null;
            })
            .filter((item): item is { id: number; order: number } => item !== null);

        const response = await services.sales.approveDelivery({ invoiceDeliveries });
        if (response.success) {
            showSuccessToast('Delivery approved successfully');
            onUpdate?.();
            onOpenChange(false);
        } else {
            showErrorToast(response.error?.message[0] || 'Failed to approve delivery');
        }
        setIsApproving(false);
    };

    const handleReject = async () => {
        setIsRejecting(true);
        const response = await services.sales.rejectDelivery(delivery.id);
        if (response.success) {
            showSuccessToast('Delivery rejected successfully');
            onUpdate?.();
            onOpenChange(false);
        } else {
            showErrorToast(response.error?.message[0] || 'Failed to reject delivery');
        }
        setIsRejecting(false);
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        const response = await services.sales.completeDelivery(delivery.id);
        if (response.success) {
            showSuccessToast('Delivery completed successfully');
            onUpdate?.();
            onOpenChange(false);
        } else {
            showErrorToast(response.error?.message[0] || 'Failed to complete delivery');
        }
        setIsCompleting(false);
    };

    const moveStop = (index: number, direction: 'up' | 'down') => {
        if (isDeliveryLocked) return;
        const newStops = [...stops];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= stops.length) return;

        [newStops[index], newStops[newIndex]] = [newStops[newIndex], newStops[index]];
        setStops(newStops);
    };

    const getStatusBadgeProps = (status: string) => {
        const statusMap: any = {
            pending: { status: 'warning', text: 'Pending' },
            approved: { status: 'success', text: 'Approved' },
            completed: { status: 'success', text: 'Completed' },
            rejected: { status: 'error', text: 'Rejected' },
        };
        return statusMap[status.toLowerCase()] || { status: 'info', text: status };
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            width="95%"
            maxWidth={800}
            padding={0}
            title="Delivery Route"
        >
            <YStack padding="$0" gap="$0">
                {/* Header Info */}
                <YStack padding="$4" backgroundColor="$background">
                    <YStack justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="$4">
                        <YStack flex={1}>
                            <XStack alignItems="center" gap="$2">
                                <Text fontSize="$5" fontWeight="bold">Delivery Details</Text>
                                <StatusBadge {...getStatusBadgeProps(deliveryStatus)} size="small" />
                            </XStack>
                            <Text fontSize="$3" color="$colorOverlay">Manage delivery sequence and status</Text>
                        </YStack>

                        <XStack gap="$2" flexWrap="wrap" alignItems="center">
                            {isDeliveryPending && (
                                <>
                                    <Button
                                        title="Approve"
                                        variant="primary"
                                        size="small"
                                        onPress={handleApprove}
                                        loading={isApproving}
                                        disabled={isRejecting}
                                    />
                                    <Button
                                        title="Reject"
                                        variant="primary"
                                        size="small"
                                        onPress={handleReject}
                                        loading={isRejecting}
                                        disabled={isApproving}
                                        style={{
                                            backgroundColor: theme.red10?.val,
                                            shadowColor: theme.red10?.val
                                        }}
                                    />
                                </>
                            )}
                            {isDeliveryApproved && (
                                <Button
                                    title="Complete"
                                    variant="primary"
                                    size="small"
                                    onPress={handleComplete}
                                    loading={isCompleting}
                                />
                            )}
                        </XStack>
                    </YStack>
                </YStack>

                <Separator />

                {/* Main Content Area */}
                <YStack padding="$4" gap="$4">
                    {/* Explicit Map Button for Mobile */}
                    <Button
                        title="VIEW ROUTE ON MAP"
                        variant="primary"
                        size="large"
                        onPress={() => setIsMapOpen(true)}
                        icon={<MapIcon size={20} color="white" />}
                        fullWidth
                    />

                    {routeInfo && (
                        <XStack
                            backgroundColor="$blue2"
                            padding="$3"
                            borderRadius="$4"
                            justifyContent="space-around"
                            borderWidth={1}
                            borderColor="$blue5"
                        >
                            <YStack alignItems="center">
                                <Text fontSize="$2" color="$colorOverlay">Distance</Text>
                                <Text fontSize="$4" fontWeight="bold" color="$blue10">{routeInfo.distance}</Text>
                            </YStack>
                            <Separator vertical />
                            <YStack alignItems="center">
                                <Text fontSize="$2" color="$colorOverlay">Est. Time</Text>
                                <Text fontSize="$4" fontWeight="bold" color="$blue10">{routeInfo.duration}</Text>
                            </YStack>
                        </XStack>
                    )}

                    {/* Stops List */}
                    <YStack gap="$3">
                        <H4 fontSize="$4">Stops ({stops.length})</H4>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{ maxHeight: 400 }}
                        >
                            <YStack gap="$3" paddingBottom="$4">
                                {stops.map((stop, index) => (
                                    <XStack
                                        key={index}
                                        backgroundColor="$backgroundHover"
                                        padding="$3"
                                        borderRadius="$4"
                                        alignItems="center"
                                        gap="$3"
                                        borderWidth={1}
                                        borderColor="$borderColor"
                                    >
                                        <Circle
                                            size={28}
                                            backgroundColor={stop.type === 'PICK UP' ? '$blue10' : '$green10'}
                                        >
                                            <Text color="white" fontWeight="bold" fontSize="$1">{index + 1}</Text>
                                        </Circle>
                                        <YStack flex={1}>
                                            <Text fontSize="$3" fontWeight="600" numberOfLines={2}>
                                                {stop.label}
                                            </Text>
                                            <XStack gap="$2" marginTop="$1">
                                                <View
                                                    backgroundColor={stop.type === 'PICK UP' ? '$blue5' : '$green5'}
                                                    paddingHorizontal="$2"
                                                    paddingVertical="$1"
                                                    borderRadius="$2"
                                                >
                                                    <Text
                                                        fontSize="$1"
                                                        fontWeight="bold"
                                                        color={stop.type === 'PICK UP' ? '$blue10' : '$green10'}
                                                    >
                                                        {stop.type}
                                                    </Text>
                                                </View>
                                            </XStack>
                                        </YStack>
                                        {!isDeliveryLocked && (
                                            <YStack gap="$1">
                                                <TouchableOpacity onPress={() => moveStop(index, 'up')}>
                                                    <ChevronUp size={20} color={index === 0 ? '$colorDisabled' : '$color'} />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => moveStop(index, 'down')}>
                                                    <ChevronDown size={20} color={index === stops.length - 1 ? '$colorDisabled' : '$color'} />
                                                </TouchableOpacity>
                                            </YStack>
                                        )}
                                    </XStack>
                                ))}
                            </YStack>
                        </ScrollView>
                    </YStack>
                </YStack>
            </YStack>

            {/* Separate Map Popup */}
            <AppDialog
                open={isMapOpen}
                onOpenChange={setIsMapOpen}
                width="100%"
                maxHeight="95%"
                padding={0}
                title="Delivery Map & Directions"
            >
                <YStack flex={1}>
                    <DeliveryRouteMap
                        stops={stops}
                        onRouteInfoReady={(info) => setRouteInfo(info)}
                    />
                    {routeInfo && (
                        <XStack
                            padding="$4"
                            backgroundColor="$background"
                            borderTopWidth={1}
                            borderColor="$borderColor"
                            justifyContent="space-between"
                        >
                            <YStack>
                                <Text fontSize="$2" color="$colorOverlay">Total Distance</Text>
                                <Text fontSize="$4" fontWeight="bold">{routeInfo.distance}</Text>
                            </YStack>
                            <YStack alignItems="flex-end">
                                <Text fontSize="$2" color="$colorOverlay">Estimated Time</Text>
                                <Text fontSize="$4" fontWeight="bold">{routeInfo.duration}</Text>
                            </YStack>
                        </XStack>
                    )}
                </YStack>
            </AppDialog>
        </AppDialog>
    );
};
