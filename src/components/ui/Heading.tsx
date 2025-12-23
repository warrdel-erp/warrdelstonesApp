import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { textStyles, theme } from '../../theme';
import { Icon } from './Icon';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingAlignment = 'left' | 'center' | 'right';

export interface HeadingProps {
    /**
     * Heading level (1-6)
     * @default 4
     */
    level?: HeadingLevel;

    /**
     * Main heading text
     */
    children: React.ReactNode;

    /**
     * Optional subheading text
     */
    subheading?: React.ReactNode;

    /**
     * Text alignment
     * @default 'left'
     */
    alignment?: HeadingAlignment;

    /**
     * Icon name to display before the heading (Lucide icon)
     */
    icon?: string;

    /**
     * Icon family (if not using default Lucide)
     */
    iconFamily?: 'Lucide' | 'MaterialIcons' | 'FontAwesome' | 'Ionicons' | 'Feather';

    /**
     * Icon size
     * @default 24
     */
    iconSize?: number;

    /**
     * Icon color
     */
    iconColor?: string;

    /**
     * Custom style for the container
     */
    containerStyle?: ViewStyle;

    /**
     * Custom style for the heading text
     */
    headingStyle?: TextStyle;

    /**
     * Custom style for the subheading text
     */
    subheadingStyle?: TextStyle;

    /**
     * Custom color for the heading
     */
    color?: string;

    /**
     * Custom color for the subheading
     */
    subheadingColor?: string;

    /**
     * Gap between heading and subheading
     * @default theme.spacing.xs
     */
    gap?: number;

    /**
     * Gap between icon and heading
     * @default theme.spacing.sm
     */
    iconGap?: number;

    /**
     * Show separator line below heading
     */
    showSeparator?: boolean;

    /**
     * Separator color
     */
    separatorColor?: string;
}

const getHeadingStyle = (level: HeadingLevel): TextStyle => {
    switch (level) {
        case 1:
            return textStyles.h1;
        case 2:
            return textStyles.h2;
        case 3:
            return textStyles.h3;
        case 4:
            return textStyles.h4;
        case 5:
            return textStyles.h5;
        case 6:
            return textStyles.h6;
        default:
            return textStyles.h4;
    }
};

const getSubheadingStyle = (level: HeadingLevel): TextStyle => {
    // Subheading is typically one or two sizes smaller than the heading
    switch (level) {
        case 1:
            return textStyles.h3;
        case 2:
            return textStyles.h4;
        case 3:
            return textStyles.h5;
        case 4:
            return textStyles.body1;
        case 5:
            return textStyles.caption;
        case 6:
            return textStyles.caption;
        default:
            return textStyles.body1;
    }
};

export const Heading: React.FC<HeadingProps> = ({
    level = 4,
    children,
    subheading,
    alignment = 'left',
    icon,
    iconFamily = 'Lucide',
    iconSize,
    iconColor,
    containerStyle,
    headingStyle,
    subheadingStyle,
    color,
    subheadingColor,
    gap,
    iconGap,
    showSeparator = false,
    separatorColor,
}) => {
    const headingTextStyle = getHeadingStyle(level);
    const subheadingTextStyle = getSubheadingStyle(level);

    // Calculate icon size based on heading level if not provided
    const calculatedIconSize = iconSize || (level <= 2 ? 22 : level <= 4 ? 20 : 18);

    // Calculate icon top offset to align with text baseline
    // This compensates for the line height difference between icon and text
    const getIconTopOffset = (): number => {
        switch (level) {
            case 1:
                return 4;
            case 2:
                return 3;
            case 3:
                return 2;
            case 4:
                return 2;
            case 5:
                return 1;
            case 6:
                return 1;
            default:
                return 2;
        }
    };

    const getAlignmentStyle = (): ViewStyle => {
        switch (alignment) {
            case 'center':
                return { alignItems: 'center' };
            case 'right':
                return { alignItems: 'flex-end' };
            case 'left':
            default:
                return { alignItems: 'flex-start' };
        }
    };

    const getTextAlignment = (): TextStyle => {
        switch (alignment) {
            case 'center':
                return { textAlign: 'center' };
            case 'right':
                return { textAlign: 'right' };
            case 'left':
            default:
                return { textAlign: 'left' };
        }
    };

    const containerStyles: ViewStyle = {
        ...getAlignmentStyle(),
        gap: gap !== undefined ? gap : theme.spacing.xs,
        ...(showSeparator && {
            paddingBottom: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: separatorColor || theme.colors.border.medium,
        }),
        ...containerStyle,
    };

    const finalHeadingStyle: TextStyle = {
        ...headingTextStyle,
        ...getTextAlignment(),
        ...(color && { color }),
        ...headingStyle,
    };

    const finalSubheadingStyle: TextStyle = {
        ...subheadingTextStyle,
        ...getTextAlignment(),
        ...(subheadingColor ? { color: subheadingColor } : { color: theme.colors.text.secondary }),
        ...subheadingStyle,
    };

    return (
        <View style={containerStyles}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: iconGap !== undefined ? iconGap : theme.spacing.sm,
                    ...(alignment === 'center' && { justifyContent: 'center' }),
                    ...(alignment === 'right' && { justifyContent: 'flex-end' }),
                }}>
                {icon && (
                    <View
                        style={{
                            paddingTop: getIconTopOffset(), // Align icon with first line of text
                            justifyContent: 'flex-start',
                        }}>
                        <Icon
                            name={icon}
                            family={iconFamily}
                            size={calculatedIconSize}
                            color={iconColor || color || theme.colors.text.primary}
                        />
                    </View>
                )}
                <View style={{ flex: icon ? 1 : 0, gap: gap !== undefined ? gap / 2 : theme.spacing.xs / 2 }}>
                    <Text style={finalHeadingStyle}>{children}</Text>
                    {subheading && <Text style={finalSubheadingStyle}>{subheading}</Text>}
                </View>
            </View>
        </View>
    );
};

export default Heading;

