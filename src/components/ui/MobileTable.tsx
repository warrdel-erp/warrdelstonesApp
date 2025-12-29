import {
    ChevronDown,
    ChevronUp,
    MoreVertical,
    RefreshCw,
    Search,
} from '@tamagui/lucide-icons';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Avatar,
    Input,
    Separator,
    Text,
    XStack,
    YStack,
    getTokens,
    useTheme,
} from 'tamagui';
import { Badge } from './Badge';
import { CheckBox } from './CheckBox';
import Spinner from './Spinner';
import { StatusBadge } from './StatusBadge';

/**
 * Sort direction type
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Column configuration interface
 */
export interface Column<T = any> {
    /** Unique identifier for the column */
    id: string;
    /** Display label for the column header */
    label: string;
    /** Column width (percentage string like "20%" or number) */
    width?: string | number;
    /** Text alignment for column content */
    align?: 'left' | 'right' | 'center';
    /** Whether the column is sortable */
    sortable?: boolean;
    /** Whether the column is searchable (default: true) */
    searchable?: boolean;
    /** Custom render function for column content */
    render?: (value: any, row: T, index: number) => React.ReactNode;
    /** Data accessor key or nested path (e.g., 'user.name') */
    accessorKey?: string;
    /** Column type for specialized rendering */
    type?: 'text' | 'number' | 'date' | 'boolean' | 'avatar' | 'chip' | 'actions' | 'money';
    /** Format function for the column value */
    format?: (value: any) => string;
    /** Footer value or render function */
    footer?: string | number | ((value: any, row: T, index: number, data: T[]) => React.ReactNode);
    /** Whether the column should be hidden */
    hidden?: boolean;
    /** Show this column in card header (primary info) */
    isPrimary?: boolean;
    /** Show this column in card secondary line */
    isSecondary?: boolean;
}

/**
 * Action configuration for row actions
 */
export interface RowAction<T = any> {
    /** Unique identifier for the action */
    id: string;
    /** Display label for the action */
    label: string;
    /** Icon for the action */
    icon: React.ReactNode;
    /** Action handler function */
    onClick: (row: T, index: number) => void;
    /** Whether the action is disabled */
    disabled?: (row: T) => boolean;
    /** Action color theme */
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | ((row: T) => 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success');
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
    /** Current page number */
    page: number;
    /** Number of items per page */
    pageSize: number;
    /** Total number of items */
    total: number;
}

/**
 * Props for the MobileTable component
 */
export interface MobileTableProps<T = any> {
    /** Array of column configurations */
    columns: Column<T>[];
    /** Array of data objects to display */
    data: T[];
    /** Whether the table is in loading state */
    loading?: boolean;
    /** Error message to display */
    error?: string;
    /** Table title */
    title?: string;
    /** Table subtitle */
    subtitle?: string;
    /** Whether to show row selection */
    selectable?: boolean;
    /** Selected row IDs */
    selectedRows?: (string | number)[];
    /** Selection change handler */
    onSelectionChange?: (selectedRows: (string | number)[]) => void;
    /** Row actions configuration */
    rowActions?: RowAction<T>[];
    /** Global actions configuration */
    globalActions?: RowAction<T>[];
    /** Sort configuration */
    sortConfig?: {
        field: string;
        direction: SortDirection;
    };
    /** Sort change handler */
    onSortChange?: (field: string, direction: SortDirection) => void;
    /** Pagination configuration */
    pagination?: PaginationConfig;
    /** Pagination change handler */
    onPaginationChange?: (page: number, pageSize: number) => void;
    /** Row click handler */
    onRowClick?: (row: T, index: number) => void;
    /** Whether rows are clickable */
    clickable?: boolean;
    /** Custom empty state message */
    emptyMessage?: string;
    /** Whether to show search */
    searchable?: boolean;
    /** Search placeholder */
    searchPlaceholder?: string;
    /** Search value */
    searchValue?: string;
    /** Search change handler */
    onSearchChange?: (value: string) => void;
    /** Whether to show refresh button */
    refreshable?: boolean;
    /** Refresh handler */
    onRefresh?: () => void;
    /** Row key function */
    getRowId?: (row: T, index: number) => string | number;
    /** Function to determine if a row is selectable */
    isRowSelectable?: (row: T, index: number) => boolean | { condition: boolean; reason: string };
    /** Expandable rows configuration */
    expandableRows?: {
        /** Function to determine if a row is expandable */
        isExpandable?: (row: T, index: number) => boolean;
        /** Function to render expanded content */
        renderExpandedContent: (row: T, index: number) => React.ReactNode;
        /** Controlled expanded rows */
        expandedRows?: (string | number)[];
        /** Expanded rows change handler */
        onExpandedRowsChange?: (expandedRows: (string | number)[], info: { changedRowId: string | number; isExpanded: boolean }) => void;
    };
    /** Card layout instead of table (better for mobile) */
    cardLayout?: boolean;
    /** Maximum height for nested tables (default: 400) */
    maxHeight?: number;
    /** Whether this is a nested table (affects layout) */
    nested?: boolean;
    /** Whether this is a child table (no scroll area, relies on parent) - REQUIRED */
    isChild: boolean;
}

/**
 * MobileTable - A comprehensive mobile table component built with Tamagui
 */
const MobileTable = memo(<T extends Record<string, any>>({
    columns,
    data = [],
    loading = false,
    error,
    title,
    subtitle,
    selectable = false,
    selectedRows = [],
    onSelectionChange,
    rowActions = [],
    globalActions = [],
    sortConfig,
    onSortChange,
    pagination,
    onPaginationChange,
    onRowClick,
    clickable = false,
    emptyMessage = 'No data available',
    searchable = false,
    searchPlaceholder = 'Search...',
    searchValue = '',
    onSearchChange,
    refreshable = false,
    onRefresh,
    getRowId = (row, index) => row.id || index,
    isRowSelectable = () => true,
    expandableRows,
    cardLayout = true,
    maxHeight = 400,
    nested = false,
    isChild,
}: MobileTableProps<T>) => {
    const tokens = getTokens();
    const theme = useTheme();
    const [actionMenuVisible, setActionMenuVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<{ row: T; index: number } | null>(null);
    const [internalExpandedRows, setInternalExpandedRows] = useState<(string | number)[]>([]);

    const currentExpandedRows = expandableRows?.expandedRows !== undefined
        ? expandableRows.expandedRows
        : internalExpandedRows;

    /**
     * Handles expanding/collapsing rows
     */
    const handleExpandToggle = useCallback((rowId: string | number) => {
        const newExpandedRows = currentExpandedRows.includes(rowId)
            ? currentExpandedRows.filter(id => id !== rowId)
            : [...currentExpandedRows, rowId];

        const isNowExpanded = newExpandedRows.includes(rowId);

        if (expandableRows?.onExpandedRowsChange) {
            expandableRows.onExpandedRowsChange(newExpandedRows, { changedRowId: rowId, isExpanded: isNowExpanded });
        } else {
            setInternalExpandedRows(newExpandedRows);
        }
    }, [currentExpandedRows, expandableRows]);

    /**
     * Handles row selection
     */
    const handleSelectAll = useCallback(() => {
        if (onSelectionChange) {
            if (selectedRows.length === data.length) {
                onSelectionChange([]);
            } else {
                const selectableIds = data
                    .map((row, index) => ({ id: getRowId(row, index), row, index }))
                    .filter(({ row, index }) => {
                        const result = isRowSelectable(row, index);
                        return typeof result === 'boolean' ? result : result.condition;
                    })
                    .map(({ id }) => id);
                onSelectionChange(selectableIds);
            }
        }
    }, [data, onSelectionChange, getRowId, isRowSelectable, selectedRows.length]);

    /**
     * Handles individual row selection
     */
    const handleSelectRow = useCallback((rowId: string | number, checked: boolean) => {
        if (onSelectionChange) {
            if (checked) {
                onSelectionChange([...selectedRows, rowId]);
            } else {
                onSelectionChange(selectedRows.filter(id => id !== rowId));
            }
        }
    }, [selectedRows, onSelectionChange]);

    /**
     * Gets value from row using accessor key
     */
    const getValue = useCallback((row: T, accessorKey?: string) => {
        if (!accessorKey) return null;
        const keys = accessorKey.split('.');
        return keys.reduce((acc, key) => acc && acc[key], row);
    }, []);

    /**
     * Renders cell content based on column type
     */
    const renderCellContent = useCallback((column: Column<T>, value: any, row: T, index: number) => {
        if (column.render) {
            return column.render(value, row, index);
        }

        switch (column.type) {
            case 'avatar':
                return (
                    <Avatar circular size="$3">
                        <Avatar.Image src={typeof value === 'string' ? value : undefined} />
                        <Avatar.Fallback backgroundColor={theme.backgroundHover?.val}>
                            <Text fontSize={tokens.size[3].val} color={theme.textPrimary?.val}>
                                {typeof value === 'string' ? value.charAt(0).toUpperCase() : '?'}
                            </Text>
                        </Avatar.Fallback>
                    </Avatar>
                );
            case 'chip':
                return (
                    <Badge label={value?.toString() || ''} />
                );
            case 'boolean':
                return (
                    <StatusBadge
                        status={value ? 'success' : 'neutral'}
                        text={value ? 'Yes' : 'No'}
                    />
                );
            case 'date':
                return value ? new Date(value).toLocaleDateString() : '-';
            case 'number':
                return column.format ? column.format(value) : value?.toLocaleString() || '-';
            case 'money':
                return `$${value?.toLocaleString() || '0'}`;
            default:
                return column.format ? column.format(value) : value?.toString() || '-';
        }
    }, [theme, tokens]);

    /**
     * Filters out hidden columns
     */
    const visibleColumns = useMemo(() => {
        return columns.filter(column => !column.hidden);
    }, [columns]);


    /**
     * Open action menu
     */
    const handleActionMenu = useCallback((row: T, index: number) => {
        setSelectedRow({ row, index });
        setActionMenuVisible(true);
    }, []);

    /**
     * Close action menu
     */
    const handleCloseMenu = useCallback(() => {
        setActionMenuVisible(false);
        setSelectedRow(null);
    }, []);

    /**
     * Execute action
     */
    const handleAction = useCallback((action: RowAction<T>) => {
        if (selectedRow) {
            action.onClick(selectedRow.row, selectedRow.index);
            handleCloseMenu();
        }
    }, [selectedRow, handleCloseMenu]);

    /**
     * Render header
     */
    const renderHeader = () => (
        <YStack
            backgroundColor={theme.background?.val}
            paddingHorizontal={tokens.space[4].val}
            paddingVertical={tokens.space[3].val}
            gap={tokens.space[3].val}
        >
            {/* Title and Subtitle */}
            {(title || subtitle) && (
                <YStack gap={tokens.space[1].val}>
                    {title && (
                        <Text
                            fontSize={tokens.size[5].val}
                            fontWeight="600"
                            color={theme.textPrimary?.val}
                        >
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text
                            fontSize={tokens.size[3.5].val}
                            color={theme.textSecondary?.val}
                        >
                            {subtitle}
                        </Text>
                    )}
                </YStack>
            )}

            {/* Search and Actions */}
            <XStack gap={tokens.space[2].val} alignItems="center" flexWrap="wrap">
                {searchable && (
                    <XStack flex={1} minWidth={200}>
                        <Input
                            flex={1}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChangeText={onSearchChange}
                            paddingHorizontal={tokens.space[3].val}
                            paddingVertical={tokens.space[2].val}
                            fontSize={tokens.size[3.5].val}
                            backgroundColor={theme.backgroundHover?.val}
                        />
                        <XStack
                            position="absolute"
                            right={tokens.space[2].val}
                            top="50%"
                            style={{ transform: [{ translateY: -10 }] }}
                        >
                            <Search size={20} color={theme.textCaption?.val} />
                        </XStack>
                    </XStack>
                )}

                <XStack gap={tokens.space[2].val}>
                    {refreshable && (
                        <TouchableOpacity onPress={onRefresh}>
                            <YStack
                                padding={tokens.space[2].val}
                                borderRadius={tokens.radius[2].val}
                                backgroundColor={theme.backgroundHover?.val}
                            >
                                <RefreshCw size={20} color={theme.primary?.val} />
                            </YStack>
                        </TouchableOpacity>
                    )}

                    {globalActions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            onPress={() => action.onClick({} as T, -1)}
                        >
                            <YStack
                                padding={tokens.space[2].val}
                                borderRadius={tokens.radius[2].val}
                                backgroundColor={theme.backgroundHover?.val}
                            >
                                {action.icon}
                            </YStack>
                        </TouchableOpacity>
                    ))}
                </XStack>
            </XStack>

            {/* Select All */}
            {selectable && data.length > 0 && (
                <CheckBox
                    title={selectedRows.length > 0
                        ? `${selectedRows.length} selected`
                        : 'Select all'}
                    checked={selectedRows.length === data.length}
                    onChange={handleSelectAll}
                />
            )}
        </YStack>
    );

    /**
     * Render table row (traditional table layout)
     */
    const renderTableRow = ({ item: row, index }: { item: T; index: number }) => {
        const rowId = getRowId(row, index);
        const isSelected = selectedRows.includes(rowId);
        const isExpanded = currentExpandedRows.includes(rowId);

        const selectableResult = isRowSelectable(row, index);
        const isSelectable = typeof selectableResult === 'boolean'
            ? selectableResult
            : selectableResult.condition;

        return (
            <YStack>
                {/* Table Row */}
                <TouchableOpacity
                    onPress={() => {
                        if (clickable && onRowClick) {
                            onRowClick(row, index);
                        }
                    }}
                    activeOpacity={clickable ? 0.7 : 1}
                >
                    <XStack
                        backgroundColor={
                            isSelected
                                ? theme.backgroundHover?.val
                                : theme.background?.val
                        }
                        borderBottomWidth={1}
                        borderBottomColor={theme.borderMedium?.val}
                        paddingVertical={tokens.space[2.5].val}
                        paddingHorizontal={tokens.space[3].val}
                        alignItems="center"
                        minWidth="100%"
                    >
                        {/* Selection Checkbox */}
                        {selectable && (
                            <YStack width={40} minWidth={40} alignItems="center">
                                {isSelectable && (
                                    <CheckBox
                                        title=""
                                        checked={isSelected}
                                        onChange={(checked: Boolean) => handleSelectRow(rowId, Boolean(checked))}
                                    />
                                )}
                            </YStack>
                        )}

                        {/* Expand Icon */}
                        {expandableRows && (
                            <YStack width={40} minWidth={40} alignItems="center">
                                {(!expandableRows.isExpandable || expandableRows.isExpandable(row, index)) && (
                                    <TouchableOpacity onPress={() => handleExpandToggle(rowId)}>
                                        {isExpanded ? (
                                            <ChevronUp
                                                size={18}
                                                color={theme.primary?.val}
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={18}
                                                color={theme.textSecondary?.val}
                                            />
                                        )}
                                    </TouchableOpacity>
                                )}
                            </YStack>
                        )}

                        {/* Data Cells */}
                        {visibleColumns.map((column, colIndex) => {
                            const value = getValue(row, column.accessorKey || column.id);
                            const cellWidth = column.width || 150;

                            return (
                                <YStack
                                    key={column.id}
                                    width={cellWidth}
                                    minWidth={cellWidth}
                                    paddingHorizontal={tokens.space[2].val}
                                >
                                    <Text
                                        fontSize={tokens.size[3.5].val}
                                        color={theme.textPrimary?.val}
                                        numberOfLines={2}
                                        textAlign={column.align || 'left'}
                                    >
                                        {renderCellContent(column, value, row, index)}
                                    </Text>
                                </YStack>
                            );
                        })}

                        {/* Actions */}
                        {rowActions.length > 0 && (
                            <YStack width={80} minWidth={80} alignItems="center">
                                <TouchableOpacity onPress={() => handleActionMenu(row, index)}>
                                    <MoreVertical
                                        size={18}
                                        color={theme.textSecondary?.val}
                                    />
                                </TouchableOpacity>
                            </YStack>
                        )}
                    </XStack>
                </TouchableOpacity>

                {/* Expanded Content */}
                {isExpanded && expandableRows && (
                    <YStack
                        backgroundColor={theme.backgroundSecondary?.val}
                        padding={tokens.space[4].val}
                        borderBottomWidth={1}
                        borderBottomColor={theme.borderMedium?.val}
                        borderLeftWidth={3}
                        borderLeftColor={theme.primary?.val}
                    >
                        {expandableRows.renderExpandedContent(row, index)}
                    </YStack>
                )}
            </YStack>
        );
    };

    /**
     * Render empty state
     */
    const renderEmptyState = () => (
        <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding={tokens.space[6].val}
            gap={tokens.space[3].val}
        >
            <Search size={48} color={theme.textCaption?.val} />
            <Text
                fontSize={tokens.size[4].val}
                fontWeight="600"
                color={theme.textPrimary?.val}
            >
                {emptyMessage}
            </Text>
            <Text
                fontSize={tokens.size[3.5].val}
                color={theme.textSecondary?.val}
                textAlign="center"
            >
                Try adjusting your search or filter criteria
            </Text>
        </YStack>
    );

    /**
     * Render footer with pagination
     */
    const renderFooter = () => {
        if (!pagination) return null;

        const totalPages = Math.ceil(pagination.total / pagination.pageSize);
        const startItem = (pagination.page - 1) * pagination.pageSize + 1;
        const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);

        return (
            <YStack
                backgroundColor={theme.background?.val}
                padding={tokens.space[4].val}
                gap={tokens.space[3].val}
                borderTopWidth={1}
                borderTopColor={theme.borderMedium?.val}
            >
                <Text
                    fontSize={tokens.size[3].val}
                    color={theme.textSecondary?.val}
                    textAlign="center"
                >
                    Showing {startItem} to {endItem} of {pagination.total} entries
                </Text>

                <XStack justifyContent="center" gap={tokens.space[2].val}>
                    <TouchableOpacity
                        onPress={() => onPaginationChange?.(pagination.page - 1, pagination.pageSize)}
                        disabled={pagination.page === 1}
                    >
                        <YStack
                            padding={tokens.space[2].val}
                            paddingHorizontal={tokens.space[4].val}
                            borderRadius={tokens.radius[2].val}
                            backgroundColor={
                                pagination.page === 1
                                    ? theme.backgroundHover?.val
                                    : theme.primary?.val
                            }
                            opacity={pagination.page === 1 ? 0.5 : 1}
                        >
                            <Text
                                fontSize={tokens.size[3.5].val}
                                color={
                                    pagination.page === 1
                                        ? theme.textSecondary?.val
                                        : theme.background?.val
                                }
                                fontWeight="600"
                            >
                                Previous
                            </Text>
                        </YStack>
                    </TouchableOpacity>

                    <YStack
                        padding={tokens.space[2].val}
                        paddingHorizontal={tokens.space[4].val}
                        borderRadius={tokens.radius[2].val}
                        backgroundColor={theme.backgroundHover?.val}
                    >
                        <Text
                            fontSize={tokens.size[3.5].val}
                            color={theme.textPrimary?.val}
                            fontWeight="600"
                        >
                            {pagination.page} / {totalPages}
                        </Text>
                    </YStack>

                    <TouchableOpacity
                        onPress={() => onPaginationChange?.(pagination.page + 1, pagination.pageSize)}
                        disabled={pagination.page >= totalPages}
                    >
                        <YStack
                            padding={tokens.space[2].val}
                            paddingHorizontal={tokens.space[4].val}
                            borderRadius={tokens.radius[2].val}
                            backgroundColor={
                                pagination.page >= totalPages
                                    ? theme.backgroundHover?.val
                                    : theme.primary?.val
                            }
                            opacity={pagination.page >= totalPages ? 0.5 : 1}
                        >
                            <Text
                                fontSize={tokens.size[3.5].val}
                                color={
                                    pagination.page >= totalPages
                                        ? theme.textSecondary?.val
                                        : theme.background?.val
                                }
                                fontWeight="600"
                            >
                                Next
                            </Text>
                        </YStack>
                    </TouchableOpacity>
                </XStack>
            </YStack>
        );
    };

    // Error state
    if (error) {
        return (
            <YStack
                flex={1}
                backgroundColor={theme.backgroundSecondary?.val}
                padding={tokens.space[4].val}
            >
                <YStack
                    backgroundColor={theme.statusError?.val}
                    padding={tokens.space[4].val}
                    borderRadius={tokens.radius[3].val}
                >
                    <Text
                        fontSize={tokens.size[4].val}
                        color={theme.background?.val}
                        fontWeight="600"
                    >
                        Error
                    </Text>
                    <Text fontSize={tokens.size[3.5].val} color={theme.background?.val}>
                        {error}
                    </Text>
                </YStack>
            </YStack>
        );
    }

    /**
     * Render table header
     */
    const renderTableHeader = () => (
        <XStack
            backgroundColor={theme.backgroundHover?.val}
            borderBottomWidth={2}
            borderBottomColor={theme.borderMedium?.val}
            paddingVertical={tokens.space[2].val}
            paddingHorizontal={tokens.space[3].val}
            minWidth="100%"
        >
            {/* Selection Checkbox Header */}
            {selectable && (
                <YStack width={40} minWidth={40} alignItems="center">
                    <CheckBox
                        title=""
                        checked={selectedRows.length === data.length && data.length > 0}
                        onChange={handleSelectAll}
                    />
                </YStack>
            )}

            {/* Expand Icon Header */}
            {expandableRows && (
                <YStack width={40} minWidth={40} />
            )}

            {/* Column Headers */}
            {visibleColumns.map((column) => {
                const cellWidth = column.width || 150;

                return (
                    <YStack
                        key={column.id}
                        width={cellWidth}
                        minWidth={cellWidth}
                        paddingHorizontal={tokens.space[2].val}
                    >
                        <Text
                            fontSize={tokens.size[3].val}
                            fontWeight="600"
                            color={theme.textPrimary?.val}
                            textAlign={column.align || 'left'}
                        >
                            {column.label}
                        </Text>
                    </YStack>
                );
            })}

            {/* Actions Header */}
            {rowActions.length > 0 && (
                <YStack width={80} minWidth={80} alignItems="center">
                    <Text
                        fontSize={tokens.size[3].val}
                        fontWeight="600"
                        color={theme.textPrimary?.val}
                    >
                        Actions
                    </Text>
                </YStack>
            )}
        </XStack>
    );

    return (
        <YStack flex={1} backgroundColor={theme.backgroundSecondary?.val} >
            {!nested && renderHeader()}

            {loading ? (
                <YStack flex={1} justifyContent="center" alignItems="center">
                    <Spinner size="large" />
                    <Text
                        fontSize={tokens.size[3.5].val}
                        color={theme.textSecondary?.val}
                        marginTop={tokens.space[3].val}
                    >
                        Loading...
                    </Text>
                </YStack>
            ) : isChild ? (
                // Child table - no scroll area, relies on parent scrolling
                <YStack
                    backgroundColor={theme.background?.val}
                    borderRadius={tokens.radius[3].val}
                    overflow="hidden"
                    borderWidth={1}
                    borderColor={theme.borderMedium?.val}
                    minWidth="100%"
                >
                    {renderTableHeader()}
                    {data.map((row, index) => {
                        const rowId = getRowId(row, index);
                        return (
                            <React.Fragment key={rowId.toString()}>
                                {renderTableRow({ item: row, index })}
                            </React.Fragment>
                        );
                    })}
                    {data.length === 0 && renderEmptyState()}
                </YStack>
            ) : (
                <YStack
                    flex={nested ? 0 : 1}
                    // margin={nested ? 0 : tokens.space[4].val}
                    height={nested ? maxHeight : undefined}
                    minHeight={nested ? 200 : undefined}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        style={{
                            height: nested ? maxHeight : undefined,
                            minHeight: nested ? 200 : undefined
                        }}
                        contentContainerStyle={{
                            minWidth: '100%',
                        }}
                        nestedScrollEnabled={true}
                        scrollEnabled={true}
                    >
                        <YStack
                            backgroundColor={theme.background?.val}
                            borderRadius={tokens.radius[3].val}
                            overflow="hidden"
                            borderWidth={1}
                            borderColor={theme.borderMedium?.val}
                            minWidth="100%"
                            height={nested ? maxHeight : undefined}
                        >
                            {renderTableHeader()}
                            <FlatList
                                data={data}
                                renderItem={renderTableRow}
                                keyExtractor={(item, index) => getRowId(item, index).toString()}
                                ListEmptyComponent={renderEmptyState}
                                scrollEnabled={true}
                                nestedScrollEnabled={true}
                                style={{
                                    maxHeight: nested ? maxHeight - 60 : undefined,
                                    minHeight: nested ? 150 : undefined
                                }}
                                contentContainerStyle={{
                                    flexGrow: nested ? 0 : 1,
                                }}
                            />
                        </YStack>
                    </ScrollView>

                    {/* Pagination - Outside scrollable area, right-aligned */}
                    {pagination && !nested && renderFooter()}
                </YStack>
            )}

            {/* Action Menu Modal */}
            <Modal
                visible={actionMenuVisible}
                transparent
                animationType="fade"
                onRequestClose={handleCloseMenu}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={handleCloseMenu}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <YStack
                            backgroundColor={theme.background?.val}
                            borderRadius={tokens.radius[4].val}
                            padding={tokens.space[2].val}
                            minWidth={200}
                            style={styles.menuContainer}
                        >
                            {rowActions.map((action, idx) => {
                                const isDisabled = selectedRow && action.disabled?.(selectedRow.row);
                                return (
                                    <React.Fragment key={action.id}>
                                        <TouchableOpacity
                                            onPress={() => !isDisabled && handleAction(action)}
                                            disabled={!!isDisabled}
                                        >
                                            <XStack
                                                padding={tokens.space[3].val}
                                                gap={tokens.space[2].val}
                                                alignItems="center"
                                                opacity={isDisabled ? 0.5 : 1}
                                                backgroundColor="transparent"
                                                borderRadius={tokens.radius[2].val}
                                            >
                                                {action.icon}
                                                <Text
                                                    fontSize={tokens.size[3.5].val}
                                                    color={theme.textPrimary?.val}
                                                >
                                                    {action.label}
                                                </Text>
                                            </XStack>
                                        </TouchableOpacity>
                                        {idx < rowActions.length - 1 && (
                                            <Separator marginVertical={tokens.space[1].val} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </YStack>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </YStack>
    );
});

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    menuContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

MobileTable.displayName = 'MobileTable';

export default MobileTable;

