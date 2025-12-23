import React, { useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokens, useTheme } from 'tamagui';
import { InventoryProductCard } from '../../components/inventory/InventoryProductCard';
import AppModal from '../../components/ui/AppModal.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { services } from '../../network';
import { InventoryProduct, SiplElement } from '../../types/InventoryTypes.ts';
import { showErrorToast, showSuccessToast } from '../../utils';

export interface UpdateProductsPricingModalProps {
  siplElement: SiplElement;
  visible: boolean;
  onClose: (refreshData: boolean) => void;
}

export const UpdateProductsPricingModal: React.FC<UpdateProductsPricingModalProps> = (props) => {
  const tokens = getTokens();
  const theme = useTheme();
  const { siplElement } = props;
  const [allSelected, setAllSelected] = React.useState<Boolean>(true);
  const [allInventoryProducts, setAllProducts] = React.useState<InventoryProduct[]>([]);
  const [loading, setLoading] = React.useState<Boolean>(true);
  const [settingPrice, setSettingPrice] = React.useState<Boolean>(false);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [newPrice, setNewPrice] = React.useState<string>('');

  useEffect(() => {
    if (siplElement.id) {
      getInventoryProducts(siplElement.id)
    }
  }, [siplElement.id]);

  const updateSellingPrice = async () => {
    try {
      setSettingPrice(true)
      const response = await services.inventory.updateSellingPrice({ ids: selectedProducts, sellingPrice: Number(newPrice) });
      if (response.success) {
        showSuccessToast('Product pricing updated successfully')
        props.onClose(true)
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to update product pricing')
      }
    } catch (error) {
      showErrorToast('Failed to update product pricing');
    } finally {
      setSettingPrice(false)
    }
  }

  const getInventoryProducts = async (siplId: number) => {
    try {
      const response = await services.inventory.getInventoryProducts({ siplId: siplId });
      if (response.success) {
        setAllProducts(response.data?.data ?? [])
        setSelectedProducts(response.data?.data.map(product => product.id) ?? [])
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to fetch inventory products')
      }
    } catch (error) {
      showErrorToast('Failed to fetch inventory products');
    } finally {
      setLoading(false)
    }
  }

  const toggleSelection = () => {
    if (allSelected) {
      setSelectedProducts([])
    } else {
      const allIds = allInventoryProducts.map(product => product.id);
      setSelectedProducts(allIds)
    }
    setAllSelected(!allSelected)
  }

  const toggleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  useEffect(() => {
    if (selectedProducts.length === allInventoryProducts.length) {
      setAllSelected(true)
    } else {
      setAllSelected(false)
    }
  }, [selectedProducts]);

  return (
    <AppModal
      titleStyle={{ padding: 0 }}
      contentStyle={{ padding: 0, gap: tokens.space[2].val, backgroundColor: theme.backgroundSecondary?.val }}
      visible={true}
      onClose={() => props.onClose(false)}
      fullScreen={true}
      renderInStatusBar={true}
      title={`Inventory Products - ${siplElement.invoiceCode}`}>
      {loading && <ScreenLoadingIndicator title={'Loading Products...'} />}

      {/* <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing.md,
        }}>
        <CheckBox
          title={'Select All'}
          checked={allSelected.valueOf()}
          onChange={(_: Boolean) => toggleSelection()}
        />
        <BodyText>{`${selectedProducts.length} of ${allInventoryProducts.length} products selected`}</BodyText>
      </View> */}
      {/* <Separator /> */}
      {/* <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: theme.spacing.sm,
          alignItems: 'center',
          gap: theme.spacing.sm,
        }}>
        <TextInput
          containerStyle={{ flex: 1 }}
          value={newPrice}
          onChangeText={txt => setNewPrice(txt)}
          placeholder={'Enter new price'}
          inputType={'number'}
        />
        <Button
          title={'Update'}
          onPress={updateSellingPrice}
          loading={!!settingPrice}
          variant={'primary'}
          disabled={newPrice.length === 0 || selectedProducts.length === 0}
        />
      </View> */}
      <KeyboardAwareScrollView
        contentContainerStyle={{
          gap: tokens.space[2].val,
          paddingHorizontal: tokens.space[4].val,
          backgroundColor: theme.backgroundSecondary?.val || '#F3F4F6',
          paddingVertical: tokens.space[2].val,
        }}>
        {allInventoryProducts.map((inventoryProduct, index) => (
          <InventoryProductCard
            key={inventoryProduct.id.toString()}
            product={inventoryProduct}
            isSelected={selectedProducts.includes(inventoryProduct.id)}
            onSelectionChange={toggleProductSelection}
            showCheckbox={true}
            index={index}
          />
        ))}
      </KeyboardAwareScrollView>
    </AppModal>
  );
}