import { Truck } from '@tamagui/lucide-icons';
import React from 'react';
import { Text, useTheme, XStack } from 'tamagui';
import { services } from '../../network';
import { showErrorToast } from '../../utils';
import { AppDialog, MobileTable } from '../ui';

interface TruckSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTruckSelect: (truck: any) => void;
}

export const TruckSelectionDialog: React.FC<TruckSelectionDialogProps> = ({
    open,
    onOpenChange,
    onTruckSelect,
}) => {
    const theme = useTheme();
    const [trucks, setTrucks] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            fetchTrucks();
        }
    }, [open]);

    const fetchTrucks = async () => {
        setLoading(true);
        const response = await services.sales.getFreeTrucks({ notAssignedOnly: true, page: 1, limit: 1000 });
        if (response.success) {
            setTrucks(response.data?.data || []);
        } else {
            showErrorToast(response.error?.message[0] ?? 'Failed to fetch trucks');
        }
        setLoading(false);
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Select Vehicle"
            maxWidth={600}
        >
            <MobileTable
                isChild={true}
                loading={loading}
                data={trucks}
                clickable={true}
                onRowClick={onTruckSelect}
                columns={[
                    {
                        id: 'index',
                        label: 'S. No.',
                        width: 60,
                        render: (_: any, __: any, index: number) => (
                            <Text>{index + 1}</Text>
                        ),
                    },
                    {
                        id: 'name',
                        label: 'Truck Name',
                        width: 150,
                        render: (val: string) => (
                            <XStack gap="$2" alignItems="center">
                                <Truck size={16} color={theme.blue10?.val} />
                                <Text>{val}</Text>
                            </XStack>
                        ),
                    },
                    {
                        id: 'registrationNumber',
                        label: 'Registration No.',
                        width: 150,
                        accessorKey: 'registrationNumber',
                    },
                    {
                        id: 'vehicleType',
                        label: 'Type',
                        width: 100,
                        accessorKey: 'vehicleType',
                    },
                    {
                        id: 'capacity',
                        label: 'Capacity',
                        width: 100,
                        accessorKey: 'capacity',
                    },
                ]}
            />
        </AppDialog>
    );
};
