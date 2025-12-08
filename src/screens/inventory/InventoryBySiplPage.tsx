import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, ListRenderItemInfo, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Accordion, AccordionGroup, Heading4, LabelValue } from '../../components/ui';
import Card from '../../components/ui/Card.tsx';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { useAppDispatch, useAppState, useInventory } from '../../store/hooks.ts';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import theme from '../../theme';
import { Inventory, SiplElement } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { UpdateProductsPricingModal } from './UpdateProductsPricingModal.tsx';

export const InventoryBySiplPage: React.FC = () => {
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
          {item.origin && (
            <LabelValue containerStyle={{ flex: 1 }} label={'from'} value={item.origin.name} />
          )}
        </View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <LabelValue containerStyle={{ flex: 1 }} label={'Kind:'} value={item.kind?.name} />
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
            {item.sipls.map(spl => (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center' }}
                onPress={() => setSelectedSipl(spl)}>
                <LabelValue
                  containerStyle={{ flex: 1 }}
                  label={'SIPL No:'}
                  value={spl.invoiceCode}
                />
                <LabelValue
                  containerStyle={{ flex: 1 }}
                  label={'Total Units:'}
                  value={spl.slabs?.length ?? spl.genericProducts?.length}
                />
                <LabelValue
                  containerStyle={{ flex: 1 }}
                  alignment={'right'}
                  label={'Qty:'}
                  value={(((spl.totalArea ?? 0) / 144).toFixed(2) ?? '0') + ' Sqft'}
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
      {loading ? (
        <ScreenLoadingIndicator title={'Loading Inventory...'} />
      ) : (
        <FlatList
          renderItem={renderInventoryItem}
          data={inventory?.data}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ padding: theme.spacing.sm }}
          ListEmptyComponent={() => <EmptyList />}
        />
      )}
      {selectedSipl && (
        <UpdateProductsPricingModal
          visible={true}
          onClose={(refreshData: boolean) => {
            setSelectedSipl(null);
            if (refreshData) {
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
