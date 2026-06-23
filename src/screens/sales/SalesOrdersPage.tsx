import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { getTokens, useTheme } from 'tamagui';
import { FloatingActionButton, StatusBadge, BodyText, ModernListCard } from '../../components/ui';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService';
import { ScreenId } from '../../navigation/navigationConstants';
import { services } from '../../network';
import { SalesOrder } from '../../types/SalesOrderTypes.ts';
import { showErrorToast } from '../../utils';
import appTheme from '../../theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Calendar } from '@tamagui/lucide-icons';

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
      return () => {};
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
    const statusMap: Record<
      string,
      { status: 'success' | 'warning' | 'error' | 'info'; text: string }
    > = {
      open: { status: 'info', text: 'Open' },
      closed: { status: 'success', text: 'Closed' },
      pending: { status: 'warning', text: 'Pending' },
    };
    return statusMap[status.toLowerCase()] || { status: 'info', text: status };
  };

  const ItemSeparator = () => <View style={{ height: 12 }} />;

  const renderSalesOrderItem = (listItem: ListRenderItemInfo<SalesOrder>) => {
    const item = listItem.item;
    const statusProps = getStatusBadge(item.status);

    return (
      <ModernListCard
        title={`SO-${item.clientSoNumber}`}
        statusBadge={<StatusBadge {...statusProps} variant="soft" size="small" />}
        subtitle={`${item.customer.name} • ${item.customer.scope?.value ?? '-'}`}
        tags={[
          item.soLocation.locationName,
          `By: ${item.createdBy.username}`,
          item.customerPo ? `PO: ${item.customerPo}` : null,
          item.customer.daysForHold ? `Hold: ${item.customer.daysForHold}d` : null,
        ]}
        metrics={[
          {
            label: 'Amount',
            value: `$${Number(item.totalAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            color: theme.statusSuccess?.val || '#10B981',
          },
          {
            label: '% Fulfill',
            value:
              item.fulFilled !== null && item.fulFilled !== undefined
                ? `${item.fulFilled.toFixed(2)}%`
                : 'N/A',
          },
        ]}
        footerLeft={
          <>
            <Calendar size={13} color="#64748B" />
            <BodyText
              style={{
                fontSize: 12,
                color: '#64748B',
                fontFamily: appTheme.typography.fontFamily.bold,
              }}>
              {moment(item.createdAt).format('DD-MM-YYYY HH:mm')}
            </BodyText>
          </>
        }
        footerRight={
          <TouchableOpacity
            onPress={() =>
              NavigationService.navigate(ScreenId.SALES_ORDER_DETAIL, {
                salesOrderId: item.id,
              })
            }
            style={{ padding: 4 }}>
            <MaterialIcon name="info-outline" size={20} color="#0891B2" />
          </TouchableOpacity>
        }
        onPress={() =>
          NavigationService.navigate(ScreenId.SALES_ORDER_DETAIL, {
            salesOrderId: item.id,
          })
        }
      />
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
