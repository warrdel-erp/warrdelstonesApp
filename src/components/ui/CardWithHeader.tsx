import { MoreVertical } from '@tamagui/lucide-icons';
import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { getTokens, useTheme, XStack, YStack, YStackProps } from 'tamagui';
import { Heading } from '.';
import ActionMenu, { ActionMenuItem } from './ActionMenu';
import { Badge } from './Badge';

export interface CardBadge {
    label: string;
    backgroundColor?: string;
    textColor?: string;
}

export type CardWithHeaderVariant = 'default' | 'highlighted';
export type CardWithHeaderColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'teal';

export interface CardWithHeaderProps {
    /** Top badges positioned absolutely at the top left */
    badges?: CardBadge[];
    /** Header title - can be ReactNode for custom styling */
    title?: ReactNode;
    /** List of actions to show in the kebab menu */
    actions?: ActionMenuItem[];
    /** Custom actions ReactNode (takes precedence over actions list) */
    customActions?: ReactNode;
    /** Main body content */
    children: ReactNode;
    /** Card variant for different visual styles
     * @default 'default'
     */
    variant?: CardWithHeaderVariant;
    /** Color scheme for highlighted variant
     * @default 'blue'
     */
    color?: CardWithHeaderColor;
    /** Card container props */
    containerProps?: YStackProps;
    /** Custom card style */
    style?: ViewStyle;
    /** Show border at bottom of header */
    headerBorder?: boolean;
    /** Gap between header and body */
    bodyGap?: number;
    /** Subheading text */
    subheading?: string;
}

export const CardWithHeader: React.FC<CardWithHeaderProps> = ({
    badges,
    title,
    actions,
    customActions,
    children,
    variant = 'default',
    color = 'blue',
    containerProps,
    style,
    headerBorder = false,
    bodyGap,
    subheading,
}) => {
    const tokens = getTokens();
    const theme = useTheme();

    // Get color styles for highlighted variant
    const getColorStyles = (): { backgroundColor: string; borderColor: string } => {
        switch (color) {
            case 'green':
                return {
                    backgroundColor: theme.green2?.val || '#F0FDF4',
                    borderColor: theme.green6?.val || '#22C55E',
                };
            case 'red':
                return {
                    backgroundColor: theme.red2?.val || '#FEF2F2',
                    borderColor: theme.red6?.val || '#EF4444',
                };
            case 'yellow':
                return {
                    backgroundColor: theme.yellow2?.val || '#FEFCE8',
                    borderColor: theme.yellow6?.val || '#EAB308',
                };
            case 'purple':
                return {
                    backgroundColor: '#FAF5FF',
                    borderColor: '#9333EA',
                };
            case 'teal':
                return {
                    backgroundColor: '#F0FDFA',
                    borderColor: '#14B8A6',
                };
            case 'blue':
            default:
                return {
                    backgroundColor: theme.blue2?.val || '#EFF6FF',
                    borderColor: theme.blue6?.val || '#3B82F6',
                };
        }
    };

    // Get variant styles
    const getVariantStyles = (): YStackProps => {
        if (variant === 'highlighted') {
            const colorStyles = getColorStyles();
            return {
                backgroundColor: colorStyles.backgroundColor,
                borderWidth: 2,
                borderColor: colorStyles.borderColor,
                shadowOpacity: 0.15,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
            };
        }

        // default variant
        return {
            backgroundColor: theme.background?.val || '#FFFFFF',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        };
    };

    const variantStyles = getVariantStyles();

    // Render actions menu or custom actions
    const renderActions = () => {
        if (customActions) {
            return customActions;
        }

        if (actions && actions.length > 0) {
            return (
                <ActionMenu
                    actions={actions}
                    trigger={
                        <XStack
                            padding={tokens.space[1].val}
                            borderRadius={tokens.radius[2].val}>
                            <MoreVertical size={22} color={theme.textSecondary?.val || '#6B7280'} />
                        </XStack>
                    }
                />
            );
        }

        return null;
    };

    const renderedActions = renderActions();

    return (
        <YStack
            borderRadius={tokens.radius[5].val}
            padding={tokens.space[6].val}
            marginVertical={tokens.space[2].val}
            position="relative"
            overflow="visible"
            {...variantStyles}
            {...containerProps}
            {...(style as any)}>
            {/* Top Badges */}
            {badges && badges.length > 0 && (
                <XStack
                    position="absolute"
                    top={-12}
                    left={tokens.space[4].val}
                    alignItems="center"
                    gap={tokens.space[1].val}
                    zIndex={10}>
                    {badges.map((badge, index) => (
                        <Badge
                            key={index}
                            label={badge.label}
                            backgroundColor={badge.backgroundColor}
                            textColor={badge.textColor}
                            size="small"
                        />
                    ))}
                </XStack>
            )}

            {/* Header Section */}
            {(title || actions || customActions) && (
                <YStack marginBottom={bodyGap || tokens.space[6].val} marginTop={badges ? tokens.space[1].val : 0}>
                    <XStack
                        justifyContent="space-between"
                        alignItems="center"
                        marginBottom={headerBorder ? tokens.space[4].val : 0}
                        paddingBottom={headerBorder ? tokens.space[4].val : 0}
                        borderBottomWidth={headerBorder ? 1 : 0}
                        borderBottomColor={headerBorder ? (theme.borderLight?.val || '#F3F4F6') : 'transparent'}>
                        <YStack flex={1} marginRight={tokens.space[2].val}>
                            {typeof title === 'string' ? (
                                <Heading
                                    // fontSize={tokens.size[4].val}
                                    // fontWeight="bold"
                                    color={theme.textPrimary?.val || '#1F2937'}
                                    subheading={subheading}
                                >
                                    {title}
                                </Heading>
                            ) : (
                                title
                            )}
                        </YStack>
                        {renderedActions && <XStack alignItems="center">{renderedActions}</XStack>}
                    </XStack>
                </YStack>
            )}

            {/* Body Content */}
            <YStack>{children}</YStack>
        </YStack>
    );
};

export default CardWithHeader;

