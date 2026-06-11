import React, { useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokens, useTheme } from 'tamagui';
import { InventoryProductCard } from '../../components/inventory/InventoryProductCard';
import AppModal from '../../components/ui/AppModal.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { services } from '../../network';
import { GetProductBy } from '../../network/services/InventoryService.ts';
import { InventoryProduct } from '../../types/InventoryTypes.ts';
import { showErrorToast, showSuccessToast } from '../../utils';

export interface InventoryProductsModalProps {
  filter: GetProductBy;
  title: string;
  visible: boolean;
  onClose: (refreshData: boolean) => void;
}

export const InventoryProductsModal: React.FC<InventoryProductsModalProps> = (props) => {
  const tokens = getTokens();
  const theme = useTheme();
  const { filter, title } = props;
  const [allSelected, setAllSelected] = React.useState<Boolean>(true);
  const [allInventoryProducts, setAllProducts] = React.useState<InventoryProduct[]>([]);
  const [loading, setLoading] = React.useState<Boolean>(true);
  const [settingPrice, setSettingPrice] = React.useState<Boolean>(false);
  const [selectedProducts, setSelectedProducts] = React.useState<number[]>([]);
  const [newPrice, setNewPrice] = React.useState<string>('');

  useEffect(() => {
    if (filter) {
      getInventoryProducts(filter)
    }
  }, [JSON.stringify(filter)]);

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

  const getInventoryProducts = async (byFilter: GetProductBy) => {
    try {
      const response = await services.inventory.getInventoryProducts(byFilter);
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
      title={title}>
      {loading && <ScreenLoadingIndicator title={'Loading Products...'} />}

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
