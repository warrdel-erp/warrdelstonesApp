import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { services } from '../../network';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import theme from '../../theme';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { showErrorToast } from '../../utils';
import { Caption, Heading6, LabelValue } from '../../components/ui';
import Card from '../../components/ui/Card.tsx';
import StatusBadge from '../../components/ui/StatusBadge.tsx';
import { capitalizeWords } from '../../utils/CommonUtility.ts';
import { CustomersFilter } from '../../network/services/CustomersService.ts';
import { Customer, Customers } from '../../types/CustomerTypes.ts';

export type SupplierPageProps = {
  filter: 'active' | 'inActive' | undefined;
};

export const AllCustomersPage: React.FC<SupplierPageProps> = props => {
  const [customers, setCustomers] = React.useState<Customers>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getCustomers = async (filter: CustomersFilter) => {
    setLoading(true);
    const response = await services.customers.getCustomersList(filter);
    if (response.success) {
      setCustomers(response.data?.data ?? customers);
    } else {
      showErrorToast(response.error?.message[0] ?? 'Failed to fetch products');
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getCustomers({ status: props.filter });
      return () => {};
    }, [props.filter]),
  );

  const ItemSeparator = () => <View style={{ height: theme.spacing.sm }} />;

  const renderCustomerItem = (info: ListRenderItemInfo<Customer>) => {
    const customer = info.item;
    return (
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs }}>
            <Heading6 color={theme.colors.primary}>{customer.name}</Heading6>
            <Caption>{customer.scope.value ?? '-'}</Caption>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'flex-start',
            }}>
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Address:'}
              value={customer.addresses.find(item => item.addressType == 'REMIT')?.address ?? '-'}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: theme.spacing.xs,
            }}>
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Phone:'}
              value={customer.primaryPhoneNumber ?? '-'}
            />
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Payment Term:'}
              value={customer.paymentTerm?.value ?? '-'}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              gap: theme.spacing.xs,
            }}>
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Sales Person:'}
              value={customer.primarySalesPerson?.username ?? '-'}
            />
          </View>
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'left'}
            label={'Sales Tax:'}
            value={
              customer.salesTax ? `${customer.salesTax?.label} - ${customer.salesTax?.value}%` : '-'
            }
          />
        </View>
        <View>
          <StatusBadge
            size={'extraSmall'}
            status={customer.status == 'active' ? 'success' : 'warning'}
            text={capitalizeWords(customer.status)}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ScreenLoadingIndicator title={'Loading customers...'} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={renderCustomerItem}
          contentContainerStyle={{ padding: theme.spacing.sm }}
          ListEmptyComponent={() => <EmptyList />}
        />
      )}
    </View>
  );
};
