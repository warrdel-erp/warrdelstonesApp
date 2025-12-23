import React from 'react';
import { getTokens, Text, useTheme, XStack, YStack } from 'tamagui';
import { Badge } from './Badge';

export interface DetailItemProps {
    label: string;
    value?: string | number | React.ReactNode;
    icon?: React.ReactNode;
    type?: 'money';
    chip?: {
        label: string;
        color?: string;
        backgroundColor?: string;
    };
    fallback?: string;
    labelStyle?: any;
    valueStyle?: any;
}

export const DetailItem: React.FC<DetailItemProps> = ({
    label,
    value,
    icon,
    type,
    chip,
    fallback = '--',
    labelStyle,
    valueStyle,
}) => {
    const tokens = getTokens();
    const theme = useTheme();
    const hasIcon = !!icon;
    const hasChip = !!chip;
    const isMoney = type === 'money';

    const renderValue = () => {
        if (hasChip) {
            return (
                <Badge
                    label={chip.label || fallback}
                    backgroundColor={chip.backgroundColor || `${theme.statusInfo?.val || '#06B6D4'}33`}
                    textColor={chip.color || theme.statusInfo?.val || '#06B6D4'}
                    size="small"
                    icon={icon}
                />
            );
        }

        if (isMoney) {
            const numericValue =
                typeof value === 'number'
                    ? value
                    : typeof value === 'string'
                        ? Number(value)
                        : undefined;
            const formattedValue =
                numericValue !== undefined && !Number.isNaN(numericValue)
                    ? `$${numericValue.toFixed(2)}`
                    : fallback;

            return (
                <Text
                    fontSize={tokens.size[4].val}
                    fontWeight="normal"
                    color={theme.textPrimary?.val || '#1F2937'}
                    {...valueStyle}>
                    {formattedValue}
                </Text>
            );
        }

        if (typeof value === 'number') {
            return (
                <Text
                    fontSize={tokens.size[3.5].val}
                    fontWeight="normal"
                    color={theme.textPrimary?.val || '#1F2937'}
                    {...valueStyle}>
                    {value}
                </Text>
            );
        }

        if (typeof value === 'string') {
            return (
                <Text
                    fontSize={tokens.size[3.5].val}
                    fontWeight="normal"
                    color={theme.textPrimary?.val || '#1F2937'}
                    numberOfLines={1}
                    {...valueStyle}>
                    {value || fallback}
                </Text>
            );
        }

        // ReactNode
        if (value) {
            return value;
        }
        return (
            <Text
                fontSize={tokens.size[3.5].val}
                fontWeight="normal"
                color={theme.textPrimary?.val || '#1F2937'}
                {...valueStyle}>
                {fallback}
            </Text>
        );
    };

    if (hasIcon && !hasChip) {
        return (
            <XStack gap={tokens.space[1].val} alignItems="flex-start">
                {icon}
                <YStack gap={4}>
                    <Text
                        fontSize={tokens.size[3].val}
                        fontWeight="500"
                        color={theme.textCaption?.val || '#9CA3AF'}
                        textTransform="uppercase"
                        letterSpacing={0.5}
                        {...labelStyle}>
                        {label}
                    </Text>
                    {renderValue()}
                </YStack>
            </XStack>
        );
    }

    return (
        <YStack gap={4} alignItems="flex-start">
            <Text
                fontSize={tokens.size[3].val}
                fontWeight="500"
                color={theme.textCaption?.val || '#9CA3AF'}
                textTransform="uppercase"
                letterSpacing={0.5}
                {...labelStyle}>
                {label}
            </Text>
            {renderValue()}
        </YStack>
    );
};

export interface DetailGridItemProps extends DetailItemProps {
    /** Width of the item (e.g., '33%', '200px', etc.) */
    width?: string | number;
    /** Flex value for flexible sizing */
    flex?: number;
}

export const DetailGridItem: React.FC<DetailGridItemProps> = ({
    width,
    flex,
    ...detailProps
}) => {
    return (
        <YStack
            width={width}
            flex={flex}
            // minWidth={100}
            flexShrink={1}>
            <DetailItem {...detailProps} />
        </YStack>
    );
};

export interface DetailGridProps {
    children: React.ReactNode;
    gap?: number;
    /** Horizontal alignment of items */
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    /** Vertical alignment of items */
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
}

export const DetailGrid: React.FC<DetailGridProps> = ({
    children,
    gap,
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
}) => {
    const tokens = getTokens();
    const defaultGap = gap !== undefined ? gap : tokens.space[4].val;
    return (
        <XStack
            gap={defaultGap}
            flexWrap="wrap"
            justifyContent={justifyContent}
            alignItems={alignItems}>
            {children}
        </XStack>
    );
};

export default DetailItem;
