import React, { useEffect, useState } from 'react';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import useAsyncLoader from '../../hooks/useAsyncLoader';
import { services } from '../../network';
import { InventoryProduct } from '../../types/InventoryTypes';
import { showErrorToast, showSuccessToast } from '../../utils';
import { BodyText, Button } from '../ui';
import AppDialog from '../ui/AppDialog';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import { ScreenLoadingIndicator } from '../ui/ScreenLoadingIndicator';

export interface SwapProductDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Callback when dialog open state changes */
    onOpenChange: (open: boolean) => void;
    /** The ID of the sales order product to swap */
    salesOrderProductId: number | null;
    /** The ID of the product category to fetch available replacements from */
    productId: number | null;
    /** Callback on successful swap to refresh parent data */
    onSuccess: () => void;
}

export const SwapProductDialog: React.FC<SwapProductDialogProps> = ({
    open,
    onOpenChange,
    salesOrderProductId,
    productId,
    onSuccess,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const [inventoryProducts, setInventoryProducts] = useState<InventoryProduct[]>([]);
    const [selectedInventoryProductId, setSelectedInventoryProductId] = useState<number | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Fetch Candidates Loader
    const { loading: fetchLoading, run: runFetch } = useAsyncLoader(async (prodId: number) => {
        const response = await services.inventory.getInventoryProductForSwap(prodId);
        if (response.success && response.data?.data) {
            setInventoryProducts(response.data.data);
        } else {
            showErrorToast(response.error?.message?.[0] ?? 'Failed to fetch inventory products');
        }
    });

    // Swap Action Loader (for use in ConfirmationDialog)
    const handleConfirmSwap = async () => {
        if (salesOrderProductId === null || selectedInventoryProductId === null) return;

        const response = await services.sales.swapInventoryProduct(salesOrderProductId, selectedInventoryProductId);
        if (response.success) {
            showSuccessToast('Product swapped successfully');
            setShowConfirmDialog(false);
            onOpenChange(false);
            onSuccess();
        } else {
            showErrorToast(response.error?.message?.[0] ?? 'Failed to swap product');
            // Re-throw to let useAsyncLoader handle the loading state properly if needed, 
            // but here we just want to avoid closing the dialog.
            throw new Error('Swap failed');
        }
    };

    const { loading: swapping, run: runSwap } = useAsyncLoader(handleConfirmSwap);

    useEffect(() => {
        if (open && productId) {
            runFetch(productId);
        } else if (!open) {
            // Reset state on close
            setInventoryProducts([]);
            setSelectedInventoryProductId(null);
        }
    }, [open, productId]);

    return (
        <>
            <AppDialog
                open={open}
                onOpenChange={onOpenChange}
                title="Swap Product"
                width={500}
                footer={
                    <XStack gap={tokens.space[2].val}>
                        <Button
                            title="Cancel"
                            variant="outline"
                            onPress={() => onOpenChange(false)}
                            disabled={swapping}
                        />
                        <Button
                            title="Submit"
                            variant="primary"
                            disabled={selectedInventoryProductId === null || swapping}
                            onPress={() => setShowConfirmDialog(true)}
                        />
                    </XStack>
                }
            >
                {fetchLoading ? (
                    <ScreenLoadingIndicator title="Fetching products..." />
                ) : (
                    <YStack gap={tokens.space[3].val}>
                        <BodyText color={theme.textSecondary?.val}>Select a product to swap with:</BodyText>
                        {inventoryProducts.length === 0 ? (
                            <YStack padding={tokens.space[6].val} alignItems="center">
                                <BodyText style={{ textAlign: 'center' }}>No available products for swap found.</BodyText>
                            </YStack>
                        ) : (
                            inventoryProducts.map((item) => {
                                const isHold = !!(item as any).hold;
                                return (
                                    <XStack
                                        key={item.id}
                                        padding={tokens.space[3].val}
                                        borderRadius={tokens.radius[2].val}
                                        borderWidth={1}
                                        borderColor={selectedInventoryProductId === item.id ? theme.blue8?.val : theme.gray5?.val}
                                        backgroundColor={selectedInventoryProductId === item.id ? theme.blue2?.val : 'transparent'}
                                        justifyContent="space-between"
                                        alignItems="center"
                                        onPress={() => setSelectedInventoryProductId(item.id)}
                                    >
                                        <YStack flex={1}>
                                            <BodyText style={{ fontWeight: '600' }}>{item.combinedNumber}</BodyText>
                                            {item.isSlabType && (item as any).slab && (
                                                <BodyText color={theme.textSecondary?.val} style={{ fontSize: 12 }}>
                                                    {`${(item as any).slab.receivingLength}" x ${(item as any).slab.receivingWidth}" = ${(item as any).slab.receivedSqrFt || 0} SF`}
                                                </BodyText>
                                            )}
                                            {isHold && (
                                                <BodyText style={{ color: theme.red9?.val, fontSize: 12 }}>
                                                    ON HOLD: {(item as any).hold}
                                                </BodyText>
                                            )}
                                        </YStack>
                                        {selectedInventoryProductId === item.id && (
                                            <YStack width={10} height={10} borderRadius={5} backgroundColor={theme.blue8?.val} />
                                        )}
                                    </XStack>
                                );
                            })
                        )}
                    </YStack>
                )}
            </AppDialog>

            <ConfirmationDialog
                open={showConfirmDialog}
                onOpenChange={setShowConfirmDialog}
                title="Confirm Swap"
                message="Are you sure you want to swap this item? This action cannot be undone."
                onConfirm={runSwap}
                confirmButtonText="Yes, Swap Item"
            />
        </>
    );
};

export default SwapProductDialog;
