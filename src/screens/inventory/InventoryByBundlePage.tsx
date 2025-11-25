import React, { useEffect } from 'react';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import theme from '../../theme';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { useAppDispatch, useAppState, useInventory } from '../../store/hooks.ts';
import { Inventory, SiplElement } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import Card from '../../components/ui/Card.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { Accordion, AccordionGroup, Heading4, LabelValue } from '../../components/ui';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UpdateProductsPricingModal } from './UpdateProductsPricingModal.tsx';
import { services } from '../../network';
import { useFocusEffect } from '@react-navigation/native';
import { getInventory } from '../../store/slices/inventorySlice.ts';

export const InventoryByBundlePage: React.FC = () => {
  const { selectedLocation } = useAppState();
  const [inventory, setInventory] = React.useState<Inventory[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocation) {
        getInventory();
      }
      return () => {};
    }, [selectedLocation]),
  );

  const getInventory = async () => {
    try {
      setLoading(true);
      const response = await services.inventory.getInventory({
        locationId: selectedLocation?.id,
        params: { page: 1, limit: 2000, categorization: 'BUNDLE' },
      });
      if (response.success) {
        setInventory(response?.data?.data ?? []);
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to fetch inventory');
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const ItemSeparator = () => <View style={{ height: theme.spacing.sm }} />;

  const renderInventoryItem = (listData: ListRenderItemInfo<Inventory>) => {
    const { item } = listData;
    return (
      <Card
        key={item.id.toString()}
        style={{ backgroundColor: theme.colors.surface }}
        onClick={() => {
          NavigationService.navigate(ScreenId.PRODUCT_DETAIL, { productId: item.id });
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.sm,
            alignItems: 'baseline',
          }}>
          <Heading4>{item.name}</Heading4>
          <LabelValue containerStyle={{ flex: 1 }} label={'from'} value={item.origin?.name} />
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <LabelValue containerStyle={{ flex: 1 }} label={'Kind:'} value={item.kind} />
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Subcategory:'}
            value={item.subCategory.name}
          />
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <LabelValue
            containerStyle={{ flex: 1 }}
            label={'Color:'}
            value={item.baseColor?.name ?? 'NA'}
          />
          <LabelValue
            containerStyle={{ flex: 1 }}
            label={'Group:'}
            alignment={'right'}
            value={item.group?.name ?? 'NA'}
          />
        </View>

        <AccordionGroup allowMultiple={true} gap={theme.spacing.sm}>
          <Accordion contentStyle={{ gap: theme.spacing.xs }}>
            {item.bundles.map(bundle => (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                  NavigationService.navigate(ScreenId.SLABS_LIST, {
                    inventory: item,
                    bundleId: bundle.bundle,
                  });
                }}>
                <LabelValue containerStyle={{ flex: 1 }} label={'Bundle:'} value={bundle.bundle} />
                <LabelValue
                  containerStyle={{ flex: 1 }}
                  label={'Units:'}
                  value={bundle?.slabs?.length || '0'}
                />
                <LabelValue
                  containerStyle={{ flex: 2 }}
                  label={'Qty:'}
                  value={`${bundle?.totalQuantity ?? '0'} ${item.uom?.code}`}
                />
                <Icon name={'keyboard-arrow-right'} size={18} />
              </TouchableOpacity>
            ))}
          </Accordion>
        </AccordionGroup>
      </Card>
    );
  };

  return (
    <View>
      <FlatList
        data={inventory.filter(i => i.bundles.length > 0)}
        keyExtractor={item => (item.id + item.name).toString()}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={renderInventoryItem}
        contentContainerStyle={{ padding: theme.spacing.sm }}
        ListEmptyComponent={() => <EmptyList />}
      />
      {loading && <ScreenLoadingIndicator title={'Loading Inventory...'} />}
    </View>
  );
};
