import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import { YStack, getTokens, useTheme } from 'tamagui';
import { Heading } from '../../components/ui';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { useAppDispatch, useAppState, useInventory } from '../../store/hooks.ts';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import { Inventory, SiplElement } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { UpdateProductsPricingModal } from './UpdateProductsPricingModal.tsx';

export const InventoryBySiplPage: React.FC = () => {
  const tokens = getTokens();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedLocation } = useAppState();
  const { inventory, loading, error } = useInventory();
  const [selectedSipl, setSelectedSipl] = React.useState<SiplElement | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocation) {
        dispatch(
          getInventory({ locationId: selectedLocation.id, params: { page: 1, limit: 2000 } }),
        );
      }
      return () => { };
    }, [selectedLocation, dispatch]),
  );

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const ItemSeparator = () => <View style={{ height: tokens.space[2].val }} />;

  const renderInventoryItem = (listData: ListRenderItemInfo<Inventory>) => {
    const { item } = listData;
    return (
      <TouchableOpacity
        key={item.id.toString()}
        onPress={() => {
          NavigationService.navigate(ScreenId.PRODUCT_DETAIL, { productId: item.id });
        }}
        activeOpacity={0.9}>
        <CardWithHeader
          title={
            <Heading
              level={4}
              icon="Package"
              iconColor={theme.primary?.val}
              subheading={item.origin ? `from ${item.origin.name}` : undefined}>
              {item.name}
            </Heading>
          }>
          <DetailGridRenderer
            items={[
              {
                label: 'Kind',
                value: (item.kind as any)?.value,
                flex: 1,
              },
              {
                label: 'Subcategory',
                value: item.subCategory.name,
                flex: 2,
              },
              {
                label: 'Color',
                value: item.baseColor?.name ?? 'NA',
                flex: 1,
              },
              {
                label: 'Group',
                value: item.group?.name ?? 'NA',
                flex: 1,
              },
            ]}
            gap={tokens.space[2].val}
            containerProps={{
              marginBottom: item.sipls?.length ? tokens.space[4].val : 0,
            }}
          />

          {item.sipls?.length > 0 && (
            <YStack gap={tokens.space[3].val}>
              {item.sipls.map((spl, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedSipl(spl)}
                  activeOpacity={0.9}>
                  <CardWithHeader
                    variant="highlighted"
                    color="blue"
                    containerProps={{
                      marginVertical: 0,
                    }}>
                    <DetailGridRenderer
                      items={[
                        {
                          label: 'SIPL',
                          value: spl.invoiceCode,
                          flex: 1,
                          valueStyle: { fontWeight: 'bold' },
                        },
                        {
                          label: 'Total Units',
                          value: spl.inventoryProducts?.length,
                          flex: 1,
                        },
                        {
                          label: 'Quantity',
                          value: `${(((spl.totalArea ?? 0) / 144).toFixed(2))} Sqft`,
                          flex: 1,
                        },
                      ]}
                      gap={tokens.space[4].val}
                    />
                  </CardWithHeader>
                </TouchableOpacity>
              ))}
            </YStack>
          )}
        </CardWithHeader>
      </TouchableOpacity>
    );
  };

  console.log(inventory?.data);
  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundSecondary?.val }}>
      {loading ? (
        <ScreenLoadingIndicator title={'Loading Inventory...'} />
      ) : (
        <FlatList
          renderItem={renderInventoryItem}
          data={inventory?.data}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ padding: tokens.space[2].val }}
          ListEmptyComponent={() => <EmptyList />}
        />
      )}
      {selectedSipl && (
        <UpdateProductsPricingModal
          visible={true}
          onClose={(refreshData: boolean) => {
            setSelectedSipl(null);
            if (refreshData && selectedLocation) {
              dispatch(
                getInventory({ locationId: selectedLocation.id, params: { page: 1, limit: 2000 } }),
              );
            }
          }}
          siplElement={selectedSipl}
        />
      )}
    </View>
  );
};
