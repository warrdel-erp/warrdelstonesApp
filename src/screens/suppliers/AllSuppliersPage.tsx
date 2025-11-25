import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { PaginationParams } from '../../network/services/ProductsService.ts';
import { services } from '../../network';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import theme from '../../theme';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { showErrorToast } from '../../utils';
import { Product, ProductList } from '../../types/ProductTypes.ts';
import { PaginationData } from '../../types/InventoryTypes.ts';
import { Caption, Heading6, LabelValue } from '../../components/ui';
import Card from '../../components/ui/Card.tsx';
import StatusBadge from '../../components/ui/StatusBadge.tsx';
import { capitalizeWords } from '../../utils/CommonUtility.ts';
import { VendorFilter } from '../../network/services/VendorService.ts';
import { Vendor, Vendors } from '../../types/VendorTypes.ts';

export type SupplierPageProps = {
  filter: 'active' | 'inActive' | undefined;
};

export const AllSuppliersPage: React.FC<SupplierPageProps> = props => {
  const [vendors, setVendors] = React.useState<Vendors>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getSuppliers = async (filter: VendorFilter) => {
    setLoading(true);
    const response = await services.vendors.getVendorsList(filter);
    if (response.success) {
      setVendors(response.data?.data ?? vendors);
    } else {
      showErrorToast(response.error?.message[0] ?? 'Failed to fetch products');
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getSuppliers({ type: 'SUPPLIER', status: props.filter });
      return () => {};
    }, [props.filter]),
  );

  const ItemSeparator = () => <View style={{ height: theme.spacing.sm }} />;

  const renderProductItem = (info: ListRenderItemInfo<Vendor>) => {
    const product = info.item;
    return (
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs }}>
            <Heading6 color={theme.colors.primary}>{product.name}</Heading6>
            <Caption>{product.vendorScope ?? '-'}</Caption>
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
              label={'Currency:'}
              value={product.currency ?? '-'}
            />
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Address:'}
              value={product.remitAddress ?? '-'}
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
              value={product.primaryPhoneNo ?? '-'}
            />
            <LabelValue
              containerStyle={{ flex: 1 }}
              alignment={'left'}
              label={'Payment Term:'}
              value={product.paymentTerms?.value ?? '-'}
            />
          </View>
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'left'}
            label={'Parent Location:'}
            value={product.parentLocation?.address ?? '-'}
          />
        </View>
        <View>
          <StatusBadge
            size={'extraSmall'}
            status={product.status == 'active' ? 'success' : 'warning'}
            text={capitalizeWords(product.status)}
          />
        </View>
      </Card>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ScreenLoadingIndicator title={'Loading suppliers...'} />
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={renderProductItem}
          contentContainerStyle={{ padding: theme.spacing.sm }}
          ListEmptyComponent={() => <EmptyList />}
        />
      )}
    </View>
  );
};
