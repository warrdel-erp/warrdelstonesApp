import React from 'react';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import useAsyncLoader from '../../hooks/useAsyncLoader';
import AppDialog from './AppDialog';
import { Button } from './Button';
import { BodyText } from './Typography';

export interface ConfirmationDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Callback when dialog open state changes */
    onOpenChange: (open: boolean) => void;
    /** Dialog title */
    title: string;
    /** Dialog message/content */
    message: string;
    /** Text for the confirm button */
    confirmButtonText?: string;
    /** Text for the cancel button */
    cancelButtonText?: string;
    /** Variant for the confirm button */
    confirmButtonVariant?: 'primary' | 'secondary' | 'outline' | 'text';
    /** Async function to execute on confirm */
    onConfirm: () => Promise<void>;
    /** Optional callback when cancel is clicked */
    onCancel?: () => void;
    /** Whether to close dialog on successful confirm */
    closeOnSuccess?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onOpenChange,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    confirmButtonVariant = 'primary',
    onConfirm,
    onCancel,
    closeOnSuccess = true,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    const { loading, run } = useAsyncLoader(onConfirm);

    const handleConfirm = async () => {
        try {
            await run();
            if (closeOnSuccess) {
                onOpenChange(false);
            }
        } catch (error) {
            // Error handling is done by the async function itself (toast, etc.)
            // We don't close the dialog on error
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onOpenChange(false);
    };

    const footer = (
        <XStack gap={tokens.space[3].val} justifyContent="flex-end" width="100%">
            <Button
                title={cancelButtonText}
                variant="outline"
                onPress={handleCancel}
                disabled={loading}
            />
            <Button
                title={confirmButtonText}
                variant={confirmButtonVariant}
                onPress={handleConfirm}
                loading={loading}
                disabled={loading}
            />
        </XStack>
    );

    const handleOpenChange = (newOpen: boolean) => {
        // Prevent closing dialog while loading
        if (!loading) {
            onOpenChange(newOpen);
        }
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={handleOpenChange}
            title={title}
            showCloseButton={!loading}
            footer={footer}
            maxWidth={400}
        >
            <YStack gap={tokens.space[2].val}>
                <BodyText color={theme.textPrimary?.val || '#1F2937'}>
                    {message}
                </BodyText>
            </YStack>
        </AppDialog>
    );
};

export default ConfirmationDialog;

