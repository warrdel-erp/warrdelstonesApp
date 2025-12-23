import React from 'react';
import { getTokens, YStack, YStackProps } from 'tamagui';
import { DetailGrid, DetailGridItem, DetailGridItemProps, DetailGridProps } from './DetailItem';

interface DetailGridRendererProps {
    items: DetailGridItemProps[];
    containerProps?: YStackProps;
    /** Default width for items (e.g., '33%', '200px') */
    defaultWidth?: string | number;
    /** Default flex value for items */
    defaultFlex?: number;
    gap?: number;
    /** Horizontal alignment of items */
    justifyContent?: DetailGridProps['justifyContent'];
    /** Vertical alignment of items */
    alignItems?: DetailGridProps['alignItems'];
}

const DetailGridRenderer: React.FC<DetailGridRendererProps> = ({
    items,
    containerProps,
    defaultWidth,
    defaultFlex,
    gap,
    justifyContent = 'flex-start',
    alignItems = 'flex-start',
}) => {
    const tokens = getTokens();
    const defaultGap = gap !== undefined ? gap : tokens.space[4].val;

    if (!items?.length) {
        return null;
    }

    return (
        <YStack {...containerProps}>
            <DetailGrid
                gap={defaultGap}
                justifyContent={justifyContent}
                alignItems={alignItems}>
                {items.map((item, index) => {
                    // Use item-specific width/flex if provided, otherwise use defaults
                    const width = item.width !== undefined ? item.width : defaultWidth;
                    const flex = item.flex !== undefined ? item.flex : defaultFlex;

                    return (
                        <DetailGridItem
                            key={`${item.label}-${index}`}
                            {...item}
                            width={width}
                            flex={flex}
                        />
                    );
                })}
            </DetailGrid>
        </YStack>
    );
};

export default DetailGridRenderer;
