import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import { InventoryProduct } from '../../types/InventoryTypes';
import Card from '../ui/Card';

export interface InventoryProductCardProps {
    product: InventoryProduct & {
        slab?: {
            serialNumber?: number;
            slabNumber?: number;
            barcode?: string;
            block?: string;
            lot?: string;
            packagedSqrFt?: number;
            receivedSqrFt?: number;
            isHold?: boolean;
        };
        genericProduct?: {
            barcode?: string;
            isHold?: boolean;
        };
        landedUnitCost?: number;
    };
    isSelected: boolean;
    onSelectionChange: (productId: number) => void;
    showCheckbox?: boolean;
    style?: ViewStyle;
    index?: number;
}

export const InventoryProductCard: React.FC<InventoryProductCardProps> = ({
    product,
    isSelected,
    onSelectionChange,
    showCheckbox = true,
    style,
    index,
}) => {
    const [showActionsMenu, setShowActionsMenu] = useState(false);
    const actionsButtonRef = useRef<View>(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleSelectionChange = () => {
        onSelectionChange(product.id);
    };

    const slab = product.slab;
    const genericProduct = product.genericProduct;
    const onHand = slab?.receivedSqrFt || slab?.packagedSqrFt;
    const isOnHold = slab?.isHold || genericProduct?.isHold || false;
    const barcode = slab?.barcode || genericProduct?.barcode;

    const handleActionsPress = () => {
        actionsButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
            setMenuPosition({ x: pageX, y: pageY + height });
            setShowActionsMenu(true);
        });
    };

    const handleActionSelect = (action: string) => {
        setShowActionsMenu(false);
        // Handle actions here
        console.log(`Action selected: ${action} for product ${product.id}`);
    };

    // Get status badge color based on inventory product status
    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'INITIATE':
                return 'info';
            case 'IN_INVENTORY':
                return 'success';
            case 'ALLOCATED':
                return 'warning';
            case 'SOLD':
                return 'error';
            default:
                return 'info';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'INITIATE':
                return 'Initiate';
            case 'IN_INVENTORY':
                return 'In Inventory';
            case 'ALLOCATED':
                return 'Allocated';
            case 'SOLD':
                return 'Sold';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'INITIATE':
                return 'play-circle-outline';
            case 'IN_INVENTORY':
                return 'inventory';
            case 'ALLOCATED':
                return 'assignment';
            case 'SOLD':
                return 'check-circle';
            default:
                return 'info';
        }
    };

    const getStatusIconColor = (status: string) => {
        switch (status) {
            case 'INITIATE':
                return theme.colors.status.info;
            case 'IN_INVENTORY':
                return theme.colors.status.success;
            case 'ALLOCATED':
                return theme.colors.status.warning;
            case 'SOLD':
                return theme.colors.status.error;
            default:
                return theme.colors.text.secondary;
        }
    };

    return (
        <Card
            elevated
            style={[
                styles.card,
                isSelected && styles.cardSelected,
                style,
            ]}>
            {/* Top Left Badges: Serial Number and Slab Type */}
            <View style={styles.topLeftBadges}>
                <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>{index !== undefined ? index + 1 : '-'}</Text>
                </View>
                <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>
                        {product.isSlabType ? 'Slab' : 'Generic'}
                    </Text>
                </View>
            </View>

            {/* Main Product Info */}
            <View style={styles.mainSection}>
                <View style={styles.productHeader}>
                    <View style={styles.productInfoContainer}>
                        <Text style={styles.productNumberText}>
                            <Text style={styles.productNumberHighlight}>{product.combinedNumber}</Text>
                            <Text style={styles.productNumberDull}> | {product.bin.name} | {product.bin.warehouse.location.location}</Text>
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View ref={actionsButtonRef}>
                            <TouchableOpacity
                                style={styles.actionsButton}
                                onPress={handleActionsPress}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                <Icon name="more-vert" size={22} color={theme.colors.text.secondary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Key Info Row */}

            </View>

            {/* Data Grid - Clean Layout */}
            <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                    <View style={styles.dataColumn}>
                        <Text style={styles.dataLabel}>BL-BN-SN</Text>
                        <Text style={styles.dataValue}>
                            {slab?.block || '-'}-{slab?.lot || '-'}-{slab?.slabNumber || '-'}
                        </Text>
                    </View>
                    <View style={styles.dataColumn}>
                        <Text style={styles.dataLabel}>Barcode</Text>
                        <View style={styles.barcodeRow}>
                            <Icon name="qr-code" size={14} color="#06B6D4" />
                            <Text style={styles.dataValue} numberOfLines={1}>{barcode || '-'}</Text>
                        </View>
                    </View>
                    <View style={styles.dataColumn}>
                        <Text style={styles.dataLabel}>On Hand</Text>
                        <Text style={styles.dataValueHighlight}>
                            {onHand ? `${onHand.toFixed(2)} sqft` : 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Financial Row */}
            <View style={styles.financialRow}>
                <View style={styles.financialItem}>
                    <Text style={styles.financialLabel}>Landed Cost</Text>
                    <Text style={styles.financialValue}>
                        ${product.landedUnitCost?.toFixed(2) || '0.00'}
                    </Text>
                </View>
                <View style={styles.financialItem}>
                    <Text style={styles.financialLabel}>Selling Cost</Text>
                    <Text style={styles.financialValue}>
                        ${product.sellingPrice.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.financialItem}>
                    <Text style={styles.financialLabel}>Status</Text>
                    <View style={[
                        styles.statusBadgeContainer,
                        styles[`statusBadge${product.status}`]
                    ]}>
                        <Icon
                            name={getStatusIcon(product.status)}
                            size={12}
                            color={getStatusIconColor(product.status)}
                        />
                        <Text style={[
                            styles.statusBadgeText,
                            styles[`statusBadgeText${product.status}`]
                        ]}>
                            {getStatusText(product.status)}
                        </Text>
                    </View>
                </View>
            </View>

        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginVertical: theme.spacing.sm,
        ...theme.shadows.md,
        position: 'relative',
        overflow: 'visible',
    },
    cardSelected: {
        backgroundColor: theme.colors.white,
    },
    topLeftBadges: {
        position: 'absolute',
        top: -12,
        left: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        zIndex: 10,
    },
    topBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    topBadgeText: {
        fontSize: theme.typography.fontSize.xs,
        fontFamily: theme.typography.fontFamily.bold,
        color: theme.colors.white,
    },
    mainSection: {
        marginBottom: theme.spacing.lg,
    },
    productHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    productInfoContainer: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    headerBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    actionsButton: {
        padding: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    actionsMenu: {
        position: 'absolute',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        minWidth: 160,
        ...theme.shadows.lg,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
    menuItemText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.primary,
    },
    productNumberText: {
        fontSize: theme.typography.fontSize.base,
    },
    productNumberHighlight: {
        color: '#1F2937',
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: theme.typography.fontWeight.bold,
    },
    productNumberDull: {
        color: '#9CA3AF',
        fontFamily: theme.typography.fontFamily.regular,
        fontWeight: theme.typography.fontWeight.normal,
    },
    keyInfoRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    keyInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
        flex: 1,
    },
    keyInfoText: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#374151',
    },
    dataGrid: {
        marginBottom: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dataRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    dataColumn: {
        flex: 1,
    },
    dataLabel: {
        fontSize: theme.typography.fontSize.xs,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#9CA3AF',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dataValue: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.regular,
        color: '#111827',
    },
    dataValueHighlight: {
        fontSize: theme.typography.fontSize.sm,
        fontFamily: theme.typography.fontFamily.semiBold,
        color: '#06B6D4',
    },
    barcodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs / 2,
    },
    financialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    financialItem: {
        flex: 1,
    },
    financialLabel: {
        fontSize: theme.typography.fontSize.xs,
        fontFamily: theme.typography.fontFamily.medium,
        color: '#9CA3AF',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    financialValue: {
        fontSize: theme.typography.fontSize.base,
        fontFamily: theme.typography.fontFamily.regular,
        color: '#374151',
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs / 2,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    statusBadgeINITIATE: {
        backgroundColor: theme.colors.status.info + '20',
    },
    statusBadgeIN_INVENTORY: {
        backgroundColor: theme.colors.status.success + '20',
    },
    statusBadgeALLOCATED: {
        backgroundColor: theme.colors.status.warning + '20',
    },
    statusBadgeSOLD: {
        backgroundColor: theme.colors.status.error + '20',
    },
    statusBadgeText: {
        fontSize: theme.typography.fontSize.xs,
        fontFamily: theme.typography.fontFamily.medium,
    },
    statusBadgeTextINITIATE: {
        color: theme.colors.status.info,
    },
    statusBadgeTextIN_INVENTORY: {
        color: theme.colors.status.success,
    },
    statusBadgeTextALLOCATED: {
        color: theme.colors.status.warning,
    },
    statusBadgeTextSOLD: {
        color: theme.colors.status.error,
    },
});

export default InventoryProductCard;

