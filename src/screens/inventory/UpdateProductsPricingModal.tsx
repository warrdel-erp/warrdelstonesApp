import React, { useEffect } from 'react';
import AppModal from '../../components/ui/AppModal.tsx';
import { InventoryProduct, SiplElement } from '../../types/InventoryTypes.ts';
import { CheckBox } from '../../components/ui/CheckBox.tsx';
import { useAppDispatch } from '../../store/hooks.ts';
import { services } from '../../network';
import { showErrorToast, showSuccessToast } from '../../utils';
import {  View } from 'react-native';
import { BodyText, Button, Caption, LabelValue, TextInput } from '../../components/ui';
import theme from '../../theme';
import Separator from '../../components/ui/Separator.tsx';
import moment from 'moment';
import Card from '../../components/ui/Card.tsx';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';

export interface UpdateProductsPricingModalProps {
  siplElement: SiplElement;
  visible: boolean;
  onClose: (refreshData: boolean) => void;
}
export const UpdateProductsPricingModal: React.FC<UpdateProductsPricingModalProps> = (props) => {
const { siplElement } = props;
const [allSelected, setAllSelected] = React.useState<Boolean>(true);
const [allProducts, setAllProducts] = React.useState<InventoryProduct[]>([]);
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
      const allIds = allProducts.map(product => product.id);
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
    if (selectedProducts.length === allProducts.length) {
      setAllSelected(true)
    } else {
      setAllSelected(false)
    }
  }, [selectedProducts]);

  return (
    <AppModal
      titleStyle={{ padding: 0 }}
      contentStyle={{ padding: theme.spacing.none, gap: theme.spacing.sm }}
      visible={true}
      onClose={()=> props.onClose(false)}
      fullScreen={true}
      renderInStatusBar={true}
      title={`Inventory Products - ${siplElement.invoiceCode}`}>
      {loading && <ScreenLoadingIndicator title={'Loading Products...'} />}

      <View
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
        <BodyText>{`${selectedProducts.length} of ${allProducts.length} products selected`}</BodyText>
      </View>
      <Separator />
      <View
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
          loading={settingPrice}
          variant={'primary'}
          disabled={newPrice.length === 0 || selectedProducts.length === 0}
        />
      </View>
      <KeyboardAwareScrollView
        contentContainerStyle={{ gap: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
        {allProducts.map(product => (
          <Card
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: theme.spacing.md,
              gap: theme.spacing.sm,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                key={product.id.toString()}
                title={``}
                checked={selectedProducts.includes(product.id)}
                onChange={(_: Boolean) => toggleProductSelection(product.id)}
              />
              <BodyText>
                {product.combinedNumber} | {product.bin.name} |{' '}
                {product.bin.warehouse.location.location}
              </BodyText>
            </View>
            <View style={{ paddingHorizontal: theme.spacing.xl, gap: theme.spacing.sm }}>
              <LabelValue label={'Is Slab Type'} value={product.isSlabType ? 'Yes' : 'No'} />
              <BodyText>Price: {product.sellingPrice}</BodyText>
              <Caption>Created on: {moment(product.createdAt).format('DD/MMM/YYYY')}</Caption>
            </View>
          </Card>
        ))}
      </KeyboardAwareScrollView>
    </AppModal>
  );
}