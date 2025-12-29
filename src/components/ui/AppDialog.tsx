import { X } from '@tamagui/lucide-icons';
import React, { ReactNode } from 'react';
import { ScrollView } from 'react-native';
import {
    Dialog,
    Button as TamaguiButton,
    XStack,
    YStack,
    getTokens,
    useTheme,
} from 'tamagui';

export interface AppDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Callback when dialog open state changes */
    onOpenChange: (open: boolean) => void;
    /** Header content (title, subtitle, custom header) */
    header?: ReactNode;
    /** Dialog title (alternative to custom header) */
    title?: string;
    /** Show close button in header */
    showCloseButton?: boolean;
    /** Main content of the dialog */
    children: ReactNode;
    /** Footer content (buttons, actions, etc.) */
    footer?: ReactNode;
    /** Maximum width of the dialog */
    maxWidth?: string | number;
    /** Maximum height of the dialog */
    maxHeight?: string | number;
    /** Width of the dialog */
    width?: string | number;
    /** Custom padding */
    padding?: number;
    /** Whether dialog is modal (blocks interaction with background) */
    modal?: boolean;
}

export const AppDialog: React.FC<AppDialogProps> = ({
    open,
    onOpenChange,
    header,
    title,
    showCloseButton = true,
    children,
    footer,
    maxWidth = '95%',
    maxHeight = '90%',
    width = '100%',
    padding,
    modal = true,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const dialogPadding = padding ?? tokens.space[4].val;

    const renderHeader = () => {
        if (header) {
            return header;
        }

        if (title || showCloseButton) {
            return (
                <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    marginBottom={tokens.space[2].val}
                >
                    {title && (
                        <Dialog.Title
                            fontSize={tokens.size[5].val}
                            fontWeight="600"
                            color={theme.textPrimary?.val}
                        >
                            {title}
                        </Dialog.Title>
                    )}
                    {showCloseButton && (
                        <Dialog.Close asChild>
                            <TamaguiButton
                                size="$3"
                                circular
                                icon={X}
                                onPress={() => onOpenChange(false)}
                                backgroundColor="transparent"
                                pressStyle={{ opacity: 0.5 }}
                            />
                        </Dialog.Close>
                    )}
                </XStack>
            );
        }

        return null;
    };

    return (
        <Dialog modal={modal} open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />
                <Dialog.Content
                    bordered
                    elevate
                    key="content"
                    enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                    exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                    maxWidth={maxWidth}
                    maxHeight={maxHeight}
                    width={width}
                    minHeight={200}
                    padding={dialogPadding}
                    backgroundColor={theme.background?.val}
                    borderRadius={tokens.radius[4].val}
                >
                    <YStack gap={tokens.space[3].val}>
                        {renderHeader()}
                        <ScrollView
                            style={{ width: 300 }}
                            showsVerticalScrollIndicator={true}
                        >
                            {children}
                        </ScrollView>
                        {footer && (
                            <XStack
                                justifyContent="flex-end"
                                alignItems="center"
                                gap={tokens.space[2].val}
                                marginTop={tokens.space[2].val}
                            >
                                {footer}
                            </XStack>
                        )}
                    </YStack>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    );
};

export default AppDialog;

