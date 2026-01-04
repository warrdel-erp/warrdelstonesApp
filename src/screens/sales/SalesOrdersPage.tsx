import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { getTokens, useTheme } from 'tamagui';
import { FloatingActionButton, StatusBadge } from '../../components/ui';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService';
import { ScreenId } from '../../navigation/navigationConstants';
import { services } from '../../network';
import { SalesOrder } from '../../types/SalesOrderTypes.ts';
import { showErrorToast } from '../../utils';

export type SalesType =
  | ''
  | 'PENDING_PAYMENT'
  | 'LOADING_ORDER'
  | 'PACKAGING_LIST'
  | 'OPEN'
  | 'CLOSED';

export type SalesOrdersPageProps = { tab: SalesType };
export const SalesOrdersPage: React.FC<SalesOrdersPageProps> = props => {
  const tokens = getTokens();
  const theme = useTheme();
  const [filter, setFilter] = React.useState({
    page: 1,
    limit: 1000,
    tab: props.tab,
    search: '',
  });
  const [salesOrders, setSalesOrders] = React.useState<SalesOrder[]>([]);
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getSalesOrders();
      return () => { };
    }, [filter]),
  );

  const getSalesOrders = async () => {
    setLoading(true);

    const response = await services.sales.getSalesOrders(filter);

    if (response.success) {
      setSalesOrders(response.data?.data || []);
    } else {
      showErrorToast(response.error?.message[0] ?? 'Failed to fetch sales orders');
    }
    setLoading(false);
  };

  const handleAddSalesOrder = () => {
    NavigationService.navigate(ScreenId.ADD_SALES_ORDER);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { status: 'success' | 'warning' | 'error' | 'info'; text: string }> = {
      open: { status: 'info', text: 'Open' },
      closed: { status: 'success', text: 'Closed' },
      pending: { status: 'warning', text: 'Pending' },
    };
    return statusMap[status.toLowerCase()] || { status: 'info', text: status };
  };

  const ItemSeparator = () => <View style={{ height: tokens.space[2].val }} />;

  const renderSalesOrderItem = (listItem: ListRenderItemInfo<SalesOrder>) => {
    const item = listItem.item;
    const serialNumber = listItem.index + 1;
    const statusProps = getStatusBadge(item.status);

    const detailItems = [
      {
        label: 'Customer',
        value: `${item.customer.name}\n${item.customer.primaryPhoneNumber}`,
        width: '30%',
      },
      {
        label: 'Type',
        value: item.customer.scope?.value ?? '-',
        width: '30%',
      },
      {
        label: 'Status',
        value: <StatusBadge {...statusProps} variant="soft" size="small" />,
        width: '30%',
      },
      {
        label: 'Created By',
        value: `${item.createdBy.username}\n${item.createdBy.phone}`,
        width: '30%',
      },
      {
        label: 'Date & Time',
        value: `${moment(item.createdAt).format('DD-MM-YYYY')}\n${moment(item.createdAt).format('HH:mm:ss')}`,
        width: '30%',
      },
      {
        label: 'Location',
        value: item.soLocation.location,
        width: '30%',
      },
      {
        label: 'Amount',
        value: item.totalAmount,
        type: 'money' as const,
        valueStyle: { fontWeight: '600', color: theme.statusSuccess?.val || '#10B981' },
        width: '30%',
      },
      {
        label: 'Tax',
        value: item.tax ? `${item.tax.code} (${item.tax.value}%)` : 'N/A',
        width: '30%',
      },
      {
        label: '%Fulfill',
        value: item.fulFilled ? `${item.fulFilled.toFixed(2)}%` : 'N/A',
        width: '30%',
      },
      {
        label: 'Hold Days',
        value: item.customer.daysForHold ? `${item.customer.daysForHold} days` : 'N/A',
        width: '30%',
      },
      {
        label: 'Customer PO#',
        value: item.customerPo ?? 'N/A',
        width: '30%',
      },
      ...(item.loadingOrders?.length > 0
        ? [
          {
            label: 'Sub-Transactions',
            value: item.loadingOrders
              .map((lo) => `${lo.code}${lo.packagingList?.code ? ' | ' + lo.packagingList.code : ''}`)
              .join('\n'),
            width: '100%',
          },
        ]
        : []),
    ];

    return (
      <TouchableOpacity
        key={item.id.toString()}
        onPress={() => {
          NavigationService.navigate(ScreenId.SALES_ORDER_DETAIL, { salesOrderId: item.id });
        }}
        activeOpacity={0.9}
      >
        <CardWithHeader
          subheading='Sales Order'
          title={
            `SO-${item.clientSoNumber}`
          }
          actions={[{
            label: 'View',
            // icon: 'eye',
            onPress: () => {
              NavigationService.navigate(ScreenId.SALES_ORDER_DETAIL, { salesOrderId: item.id });
            },
          }]}
        >
          <DetailGridRenderer items={detailItems} gap={tokens.space[3].val} />
        </CardWithHeader>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundSecondary?.val }}>
      {loading ? (
        <ScreenLoadingIndicator title={'Loading Sales Orders...'} />
      ) : (
        <>
          <FlatList
            data={salesOrders}
            renderItem={renderSalesOrderItem}
            contentContainerStyle={{ padding: tokens.space[2].val }}
            ItemSeparatorComponent={ItemSeparator}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={() => <EmptyList />}
          />
          <FloatingActionButton onPress={handleAddSalesOrder} />
        </>
      )}
    </View>
  );
};
