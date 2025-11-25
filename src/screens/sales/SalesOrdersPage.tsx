import React from 'react';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { BodyText, LabelValue } from '../../components/ui';
import { services } from '../../network';
import { SalesOrder } from '../../types/SalesOrderTypes.ts';
import { showErrorToast } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import Card from '../../components/ui/Card.tsx';
import theme from '../../theme';
import moment from 'moment';
import { formatCurrency } from '../../utils/CommonUtility.ts';

export type SalesType =
  | ''
  | 'PENDING_PAYMENT'
  | 'LOADING_ORDER'
  | 'PACKAGING_LIST'
  | 'OPEN'
  | 'CLOSED';

export type SalesOrdersPageProps = { tab: SalesType };
export const SalesOrdersPage: React.FC<SalesOrdersPageProps> = props => {
  const [filter, setFilter] = React.useState({
    page: 1,
    limit: 1000,
    tab: props.tab,
    search: '',
  });
  const [salesOrders, setSalesOrders] = React.useState<SalesOrder[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      getSalesOrders();
      return () => {};
    }, [filter]),
  );

  const getSalesOrders = async () => {
    const response = await services.sales.getSalesOrders(filter);
    if (response.success) {
      setSalesOrders(response.data?.data || []);
    } else {
      showErrorToast(response.error?.message[0] ?? 'Failed to fetch sales orders');
    }
  };

  const renderSalesOrderItem = (listItem: ListRenderItemInfo<SalesOrder>) => {
    const item = listItem.item;
    return (
      <Card>
        <View style={styles.labelValueContainer}>
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'left'}
            label={'SO:'}
            value={item.id}
          />

          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Date:'}
            value={moment(item.soDate).format('DD-MMM-YYYY')}
          />
        </View>

        <LabelValue
          containerStyle={{ flex: 1 }}
          alignment={'left'}
          label={'Created by:'}
          value={`${item.createdBy.username} | ${item.createdBy.phone}`}
        />
        <View style={styles.labelValueContainer}>
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'left'}
            label={'Customer:'}
            value={`${item.customer.name} | ${item.customer.primaryPhoneNumber}`}
          />
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Type:'}
            value={item.customer.scope?.value ?? '-'}
          />
        </View>
        <LabelValue
          containerStyle={{ flex: 1 }}
          alignment={'left'}
          label={'Sale location:'}
          value={`${item.soLocation.location}`}
        />
        <View style={styles.labelValueContainer}>
          {item.tax && (
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Customer tax:'}
              value={`${item.tax?.code ?? '-'}(${item.tax?.value ? item.tax.value + '%' : '0'})`}
            />
          )}
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Amount:'}
            value={formatCurrency(item.totalAmount)}
          />
        </View>
        <View style={styles.labelValueContainer}>
          {item.tax && (
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Hold days:'}
              value={`${item.customer.daysForHold ?? '0'}`}
            />
          )}
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Cust PO:'}
            value={item.customerPo ?? 'N/A'}
          />
        </View>
        <LabelValue
          containerStyle={{ flex: 1 }}
          alignment={'left'}
          label={'Sub transactions:'}
          value={item.loadingOrders?.[0]?.code ?? 'N/A'}
        />
      </Card>
    );
  };

  return (
    <BaseScreen scrollable={false} keyboardAware={false}>
      <FlatList
        data={salesOrders}
        renderItem={renderSalesOrderItem}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.sm }}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        keyExtractor={item => item.id.toString()}
      />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  labelValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
