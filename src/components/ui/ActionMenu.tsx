import React, { useRef, useState } from 'react';
import { Modal, TouchableOpacity, ViewStyle } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import theme from '../../theme';
import { FontConfig } from '../../theme/FontConfig';

export interface ActionMenuItem {
    label: string;
    icon?: React.ComponentType<any>;
    iconColor?: string;
    onPress: () => void;
    disabled?: boolean;
    destructive?: boolean;
}

export interface ActionMenuProps {
    /** List of action items */
    actions: ActionMenuItem[];
    /** Trigger element (e.g., kebab menu button) */
    trigger: React.ReactNode;
    /** Custom menu style */
    menuStyle?: ViewStyle;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
    actions,
    trigger,
    menuStyle,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<any>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleTriggerPress = () => {
        if (triggerRef.current) {
            triggerRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                setMenuPosition({ x: pageX, y: pageY + height });
                setIsOpen(true);
            });
        }
    };

    const handleActionPress = (action: ActionMenuItem) => {
        if (!action.disabled) {
            setIsOpen(false);
            action.onPress();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <>
            <XStack ref={triggerRef}>
                <TouchableOpacity
                    onPress={handleTriggerPress}
                    activeOpacity={0.7}>
                    {trigger}
                </TouchableOpacity>
            </XStack>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={handleClose}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    }}
                    activeOpacity={1}
                    onPress={handleClose}>
                    <YStack
                        position="absolute"
                        left={menuPosition.x - 160}
                        top={menuPosition.y}
                        backgroundColor={theme.colors.white}
                        borderRadius={theme.borderRadius.md}
                        paddingVertical={theme.spacing.xs}
                        minWidth={160}
                        shadowColor={theme.colors.shadow}
                        shadowOffset={{ width: 0, height: 2 }}
                        shadowOpacity={0.2}
                        shadowRadius={8}
                        elevation={8}
                        {...(menuStyle as any)}>
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={`action-${action.label}-${index}`}
                                onPress={() => handleActionPress(action)}
                                disabled={action.disabled}
                                activeOpacity={0.7}>
                                <XStack
                                    alignItems="center"
                                    paddingHorizontal={theme.spacing.md}
                                    paddingVertical={theme.spacing.sm}
                                    gap={theme.spacing.sm}
                                    opacity={action.disabled ? 0.5 : 1}
                                >
                                    {action.icon && (
                                        React.createElement(action.icon, {
                                            size: 20,
                                            color:
                                                action.iconColor ||
                                                (action.destructive
                                                    ? theme.colors.status.error
                                                    : theme.colors.text.primary),
                                        })
                                    )}
                                    <Text
                                        fontSize={theme.typography.fontSize.sm}
                                        fontWeight={action.destructive ? '600' : 'normal'}
                                        color={
                                            action.destructive
                                                ? theme.colors.status.error
                                                : theme.colors.text.primary
                                        }
                                        style={{
                                            fontFamily: action.destructive
                                                ? FontConfig.SemiBold
                                                : FontConfig.Regular,
                                        }}>
                                        {action.label}
                                    </Text>
                                </XStack>
                            </TouchableOpacity>
                        ))}
                    </YStack>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default ActionMenu;

