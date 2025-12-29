import { Edit3 as Edit, Eye, Package, Trash } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { YStack, getTokens, useTheme } from 'tamagui';
import MobileTable, { Column, RowAction } from '../../components/ui/MobileTable';

interface SampleData {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    joinDate: string;
    salary: number;
}

interface OrderData {
    id: number;
    orderNumber: string;
    customer: string;
    amount: number;
    orderDate: string;
    status: 'pending' | 'completed' | 'cancelled';
}

// Sample orders data - each employee has associated orders
const ordersData: Record<number, OrderData[]> = {
    1: [
        { id: 101, orderNumber: 'ORD-001', customer: 'Acme Corp', amount: 5000, orderDate: '2024-01-10', status: 'completed' },
        { id: 102, orderNumber: 'ORD-002', customer: 'Tech Inc', amount: 7500, orderDate: '2024-01-15', status: 'pending' },
        { id: 103, orderNumber: 'ORD-003', customer: 'Global Ltd', amount: 3200, orderDate: '2024-01-20', status: 'completed' },
    ],
    2: [
        { id: 201, orderNumber: 'ORD-004', customer: 'Design Co', amount: 4500, orderDate: '2024-01-12', status: 'completed' },
        { id: 202, orderNumber: 'ORD-005', customer: 'Creative LLC', amount: 6000, orderDate: '2024-01-18', status: 'pending' },
    ],
    3: [
        { id: 301, orderNumber: 'ORD-006', customer: 'Enterprise Co', amount: 12000, orderDate: '2024-01-08', status: 'completed' },
        { id: 302, orderNumber: 'ORD-007', customer: 'Business Inc', amount: 8500, orderDate: '2024-01-22', status: 'cancelled' },
    ],
    4: [
        { id: 401, orderNumber: 'ORD-008', customer: 'Startup XYZ', amount: 3500, orderDate: '2024-01-14', status: 'completed' },
        { id: 402, orderNumber: 'ORD-009', customer: 'Innovation Hub', amount: 5500, orderDate: '2024-01-19', status: 'pending' },
        { id: 403, orderNumber: 'ORD-010', customer: 'Future Tech', amount: 4200, orderDate: '2024-01-21', status: 'completed' },
    ],
    5: [
        { id: 501, orderNumber: 'ORD-011', customer: 'Quality Assurance Ltd', amount: 2800, orderDate: '2024-01-16', status: 'completed' },
    ],
    6: [
        { id: 601, orderNumber: 'ORD-012', customer: 'Product Co', amount: 9500, orderDate: '2024-01-11', status: 'completed' },
        { id: 602, orderNumber: 'ORD-013', customer: 'Strategy Inc', amount: 11000, orderDate: '2024-01-17', status: 'pending' },
        { id: 603, orderNumber: 'ORD-014', customer: 'Vision Corp', amount: 7800, orderDate: '2024-01-23', status: 'completed' },
    ],
    7: [
        { id: 701, orderNumber: 'ORD-015', customer: 'Cloud Systems', amount: 6200, orderDate: '2024-01-13', status: 'completed' },
        { id: 702, orderNumber: 'ORD-016', customer: 'Infrastructure Co', amount: 8800, orderDate: '2024-01-24', status: 'pending' },
    ],
    8: [
        { id: 801, orderNumber: 'ORD-017', customer: 'Design Studio', amount: 4800, orderDate: '2024-01-09', status: 'completed' },
        { id: 802, orderNumber: 'ORD-018', customer: 'Creative Agency', amount: 5200, orderDate: '2024-01-25', status: 'pending' },
    ],
};

const sampleData: SampleData[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
        status: 'active',
        joinDate: '2023-01-15',
        salary: 75000,
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Designer',
        status: 'active',
        joinDate: '2023-02-20',
        salary: 70000,
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'Manager',
        status: 'inactive',
        joinDate: '2022-11-10',
        salary: 85000,
    },
    {
        id: 4,
        name: 'Alice Williams',
        email: 'alice@example.com',
        role: 'Developer',
        status: 'active',
        joinDate: '2023-03-05',
        salary: 78000,
    },
    {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        role: 'QA Engineer',
        status: 'active',
        joinDate: '2023-04-12',
        salary: 65000,
    },
    {
        id: 6,
        name: 'Diana Prince',
        email: 'diana@example.com',
        role: 'Product Manager',
        status: 'active',
        joinDate: '2022-09-18',
        salary: 90000,
    },
    {
        id: 7,
        name: 'Ethan Hunt',
        email: 'ethan@example.com',
        role: 'DevOps',
        status: 'inactive',
        joinDate: '2023-05-22',
        salary: 80000,
    },
    {
        id: 8,
        name: 'Fiona Green',
        email: 'fiona@example.com',
        role: 'Designer',
        status: 'active',
        joinDate: '2023-06-30',
        salary: 72000,
    },
];

const TableDemoScreen: React.FC = () => {
    const theme = useTheme();
    const tokens = getTokens();
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedRows, setExpandedRows] = useState<(string | number)[]>([]);

    const columns: Column<SampleData>[] = [
        {
            id: 'name',
            label: 'Name',
            accessorKey: 'name',
            isPrimary: true,
            sortable: true,
        },
        {
            id: 'email',
            label: 'Email',
            accessorKey: 'email',
            isSecondary: true,
        },
        {
            id: 'role',
            label: 'Role',
            accessorKey: 'role',
            type: 'chip',
        },
        {
            id: 'status',
            label: 'Status',
            accessorKey: 'status',
            type: 'boolean',
            render: (value) => value === 'active',
        },
        {
            id: 'joinDate',
            label: 'Join Date',
            accessorKey: 'joinDate',
            type: 'date',
        },
        {
            id: 'salary',
            label: 'Salary',
            accessorKey: 'salary',
            type: 'money',
            align: 'right',
        },
    ];

    // Columns for nested orders table
    const orderColumns: Column<OrderData>[] = [
        {
            id: 'orderNumber',
            label: 'Order #',
            accessorKey: 'orderNumber',
            isPrimary: true,
        },
        {
            id: 'customer',
            label: 'Customer',
            accessorKey: 'customer',
            isSecondary: true,
        },
        {
            id: 'amount',
            label: 'Amount',
            accessorKey: 'amount',
            type: 'money',
            align: 'right',
        },
        {
            id: 'orderDate',
            label: 'Date',
            accessorKey: 'orderDate',
            type: 'date',
        },
        {
            id: 'status',
            label: 'Status',
            accessorKey: 'status',
            type: 'chip',
        },
    ];

    const orderActions: RowAction<OrderData>[] = [
        {
            id: 'view',
            label: 'View Order',
            icon: <Package size={18} color={theme.primary?.val || '#0891B2'} />,
            onClick: (order) => {
                console.log('View Order:', order);
            },
            color: 'primary',
        },
    ];

    const rowActions: RowAction<SampleData>[] = [
        {
            id: 'view',
            label: 'View',
            icon: <Eye size={20} color={theme.primary?.val || '#0891B2'} />,
            onClick: (row) => {
                console.log('View:', row);
            },
            color: 'primary',
        },
        {
            id: 'edit',
            label: 'Edit',
            icon: <Edit size={20} color={theme.statusWarning?.val || '#F59E0B'} />,
            onClick: (row) => {
                console.log('Edit:', row);
            },
            color: 'warning',
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <Trash size={20} color={theme.statusError?.val || '#EF4444'} />,
            onClick: (row) => {
                console.log('Delete:', row);
            },
            color: 'error',
            disabled: (row) => row.status === 'active',
        },
    ];

    // Filter data based on search
    const filteredData = sampleData.filter((item) =>
        searchValue === ''
            ? true
            : item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.role.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Pagination
    const pageSize = 5;
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.backgroundSecondary?.val || '#F3F4F6' }}>
            <MobileTable
                title="Employee Directory"
                subtitle="Manage your team members"
                columns={columns}
                data={paginatedData}
                loading={false}
                selectable={true}
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
                searchable={true}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                refreshable={true}
                onRefresh={() => {
                    console.log('Refreshing...');
                }}
                rowActions={rowActions}
                clickable={true}
                onRowClick={(row) => {
                    console.log('Row clicked:', row);
                }}
                pagination={{
                    page: currentPage,
                    pageSize: pageSize,
                    total: filteredData.length,
                }}
                onPaginationChange={(page) => {
                    setCurrentPage(page);
                }}
                isChild={false}
                expandableRows={{
                    expandedRows: expandedRows,
                    onExpandedRowsChange: (rows) => setExpandedRows(rows),
                    renderExpandedContent: (row) => {
                        const employeeOrders = ordersData[row.id] || [];

                        return (
                            <YStack gap={tokens.space[3].val}>
                                {/* Nested Orders Table */}


                                <MobileTable
                                    columns={orderColumns}
                                    data={employeeOrders}
                                    rowActions={orderActions}
                                    clickable={true}
                                    onRowClick={(order) => {
                                        console.log('Nested order clicked:', order);
                                    }}
                                    emptyMessage="No orders assigned"
                                    isChild={true}
                                />
                            </YStack>
                        );
                    },
                }}
            />
        </View>
    );
};

export default TableDemoScreen;

