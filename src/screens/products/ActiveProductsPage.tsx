import React, { useEffect } from 'react';
import { FlatList, ListRenderItemInfo, ScrollView, View } from 'react-native';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import { PaginationParams } from '../../network/services/ProductsService.ts';
import { services } from '../../network';
import { Product, ProductList } from '../../types/ProductTypes.ts';
import { PaginationData } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { useFocusEffect } from '@react-navigation/native';
import theme from '../../theme';
import Card from '../../components/ui/Card.tsx';
import { Caption, Heading6, LabelValue } from '../../components/ui';
import StatusBadge from '../../components/ui/StatusBadge.tsx';
import { capitalizeWords } from '../../utils/CommonUtility.ts';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { EmptyList } from '../../components/ui/EmptyList.tsx';

export const ActiveProductsScreen: React.FC = () => {
  const [filter, setFilter] = React.useState<PaginationParams>({
    page: 1,
    limit: 1000,
    status: 'active',
  });
  const [products, setProducts] = React.useState<ProductList>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [nextPageLoading, setNextPageLoading] = React.useState<boolean>(false);
  const [totalItems, setTotalItems] = React.useState<PaginationData | undefined>();

  const getFilteredProducts = async (filter: PaginationParams) => {
    setLoading(filter?.page == 1);
    setNextPageLoading((filter?.page ?? 1) > 1);
    const response = await services.products.getProducts(filter);
    if (response.success) {
      setProducts(response.data?.data ?? products);
      setTotalItems(response.data?.paginationData);
    } else {
      showErrorToast(response.error?.message[0] ?? 'Failed to fetch products');
    }
    setNextPageLoading(false);
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getFilteredProducts(filter);
      return () => {};
    }, [filter]),
  );

  const ItemSeparator = () => <View style={{ height: theme.spacing.sm }} />;

  const renderProductItem = (info: ListRenderItemInfo<Product>) => {
    const product = info.item;
    return (
      <Card style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs }}>
            <Heading6>{product.name}</Heading6>
            <Caption>{product.alternativeName ?? '-'}</Caption>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.xs }}>
            <Caption>{product.subCategory.name}</Caption>
            {product.group && <Caption>{product.group?.name}</Caption>}
          </View>
          <LabelValue label={'Origin'} value={product.origin?.name ?? '-'} />
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
        <ScreenLoadingIndicator title={'Loading Inventory...'} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={renderProductItem}
          contentContainerStyle={{ padding: theme.spacing.sm }}
          ListEmptyComponent={() => <EmptyList />}
          onEndReached={() => {
            if (totalItems && products.length < totalItems.total && !nextPageLoading) {
              const newPage = (totalItems.page ?? 1) + 1;
              setFilter({ ...filter, page: newPage });
            }
          }}
        />
      )}
    </View>
  );
};
