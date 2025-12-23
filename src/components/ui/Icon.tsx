import * as LucideIcons from '@tamagui/lucide-icons';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';

export type IconFamily =
    | 'Lucide'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'FontAwesome6'
    | 'Ionicons'
    | 'Feather'
    | 'Entypo'
    | 'AntDesign';

export interface IconProps {
    /**
     * Name of the icon (e.g., 'Home', 'User', 'Settings' for Lucide)
     * Note: Lucide icons use PascalCase (e.g., 'Home', 'User', 'Settings')
     * Vector icons use lowercase with hyphens (e.g., 'home', 'user', 'settings')
     */
    name: string;

    /**
     * Icon family/library to use
     * @default 'Lucide'
     */
    family?: IconFamily;

    /**
     * Size of the icon in pixels
     * @default 24
     */
    size?: number;

    /**
     * Color of the icon
     * @default theme.colors.text.primary
     */
    color?: string;

    /**
     * Additional style props
     */
    style?: any;
}

const IconComponentMap: Record<IconFamily, any> = {
    Lucide: LucideIcons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    Feather,
    Entypo,
    AntDesign,
};

/**
 * Unified Icon component that supports multiple icon families
 * Defaults to Lucide icons from Tamagui
 * 
 * @example
 * ```tsx
 * // Simple usage with default Lucide icons (PascalCase names)
 * <Icon name="Home" />
 * <Icon name="User" />
 * <Icon name="Settings" />
 * 
 * // With custom size and color
 * <Icon name="User" size={32} color="#FF5733" />
 * 
 * // Using different icon family (lowercase with hyphens)
 * <Icon name="heart" family="FontAwesome" size={20} />
 * <Icon name="home" family="MaterialIcons" size={24} />
 * ```
 */
export const Icon: React.FC<IconProps> = ({
    name,
    family = 'Lucide',
    size = 24,
    color = theme.colors.text.primary,
    style,
}) => {
    // Handle Lucide icons (default)
    if (family === 'Lucide') {
        const LucideIcon = (LucideIcons as any)[name];

        if (!LucideIcon) {
            console.warn(`Lucide icon "${name}" not found. Available icons: ${Object.keys(LucideIcons).slice(0, 10).join(', ')}...`);
            // Fallback to a default icon or return null
            const DefaultIcon = (LucideIcons as any)['AlertCircle'];
            return DefaultIcon ? <DefaultIcon size={size} color={color} style={style} /> : null;
        }

        return <LucideIcon size={size} color={color} style={style} />;
    }

    // Handle vector icons
    const IconComponent = IconComponentMap[family];

    if (!IconComponent) {
        console.warn(`Icon family "${family}" not found. Falling back to Lucide.`);
        const LucideIcon = (LucideIcons as any)[name];
        if (LucideIcon) {
            return <LucideIcon size={size} color={color} style={style} />;
        }
        return null;
    }

    return <IconComponent name={name} size={size} color={color} style={style} />;
};

export default Icon;

