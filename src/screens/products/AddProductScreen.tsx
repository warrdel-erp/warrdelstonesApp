import React, { useCallback, useEffect } from 'react';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import theme from '../../theme';
import PagerView from 'react-native-pager-view';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { AllProductsScreen } from './AllProductsPage.tsx';
import { ActiveProductsScreen } from './ActiveProductsPage.tsx';
import { InactiveProductsScreen } from './InactiveProductsPage.tsx';
import Button from '../../components/ui/Button.tsx';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Heading4, Heading6, TextInput } from '../../components/ui';
import Card from '../../components/ui/Card.tsx';
import Dropdown, { DropdownOption } from '../../components/ui/Dropdown.tsx';
import { useAppState } from '../../store/hooks.ts';
import { ProductAccounts } from '../../types/CommonTypes.ts';
import { CheckBox } from '../../components/ui/CheckBox.tsx';
import { services } from '../../network';
import { showErrorToast, showSuccessToast } from '../../utils';
import { createObjectUpdater, sleep } from '../../utils/CommonUtility.ts';
import NavigationService from '../../navigation/NavigationService.ts';
import { AddProductPayload } from '../../network/services/ProductsService.ts';

export type AddProductForm = {
  name: string;
  kind: number;
  baseColorId: number;
  origin: number;
  thickness: number;
  categoryId: number;
  uom: number;
  groupId: number;
  finishId: number;
  subCategoryId: number;
  weight: string;
  alternativeName: string;
  singleUnitPrice: string;
  bundlePrice: string;
  binId: number;
  reorderQuantity: string;
  safetyQuantity: string;
  leadTime: string;
  notes: string;
  instructions: string;
  disclaimer: string;
  isSlabType: boolean;
};

export const AddProductScreen: React.FC = () => {
  const { bins, generalData } = useAppState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [defaultAccounts, setDefaultAccounts] = React.useState<ProductAccounts>();
  const [productForm, setProductForm] = React.useState<AddProductForm>();

  const updateForm = createObjectUpdater(setProductForm);

  useEffect(() => {
    getDefaultAccounts();
  }, []);

  const getDefaultAccounts = async () => {
    const response = await services.common.getDefaultLedgerAccountsForProduct();
    if (response.success) {
      setDefaultAccounts(response.data?.data);
    } else {
      showErrorToast(response.error?.message[0] || 'Failed to fetch default accounts');
    }
  };

  useEffect(() => {
    updateForm('uom', productForm?.categoryId == 1 ? 1 : 14);
    if (productForm?.categoryId == 2) {
      updateForm('baseColorId', undefined);
      updateForm('groupId', undefined);
      updateForm('origin', undefined);
      updateForm('finishId', undefined);
      updateForm('weight', undefined);
      updateForm('thickness', undefined);
    }
  }, [productForm?.categoryId]);

  const onSubmitClick = () => {
    const isValid = validateForm();
    if (isValid) {
      const payload: AddProductPayload = {
        name: productForm?.name?.trim() ?? '',
        alternativeName: productForm?.alternativeName?.trim() ?? '',
        kind: productForm?.kind ?? 0,
        categoryId: productForm?.categoryId == 1 ? 'slab' : 'generic',
        subCategoryId: productForm?.subCategoryId,
        baseColorId: productForm?.baseColorId,
        groupId: productForm?.groupId,
        origin: productForm?.origin,
        finishId: productForm?.finishId,
        weight: productForm?.weight,
        thickness: productForm?.thickness,
        uom: productForm?.uom ?? 0,
        singleUnitPrice: productForm?.singleUnitPrice ?? '0',
        bundlePrice: productForm?.bundlePrice ?? '0',
        binId: productForm?.binId ?? 0,
        reorderQuantity: productForm?.reorderQuantity ?? '0',
        safetyQuantity: productForm?.safetyQuantity ?? '0',
        leadTime: productForm?.leadTime ?? '0',
        notes: productForm?.notes?.trim() ?? '',
        instructions: productForm?.instructions?.trim() ?? '',
        disclaimer: productForm?.disclaimer?.trim() ?? '',
        isSlabType: (productForm?.categoryId ?? 0) == 1,
      };
      addProduct(payload);
    }
  };

  const addProduct = async (addProductPayload: AddProductPayload) => {
    setLoading(true);
    const response = await services.products.addProduct(addProductPayload);
    if (response.success) {
      showSuccessToast(response.data?.message ?? 'Product added successfully');
      NavigationService.goBack();
    } else {
      showErrorToast(response.error?.message[0] || 'Failed to add product');
    }
    setLoading(false);
  };

  const validateForm = (): boolean => {
    let message = '';
    if (!productForm?.name?.trim()) {
      message = 'Product name is required.';
    } else if (!productForm?.alternativeName?.trim()) {
      message = 'Alternative name is required.';
    } else if (!productForm?.kind) {
      message = 'Kind is required.';
    } else if (!productForm?.categoryId) {
      message = 'Category is required.';
    } else if (!productForm?.subCategoryId) {
      message = 'Sub Category is required.';
    } else if (productForm?.categoryId == 1) {
      if (!productForm?.baseColorId) {
        message = 'Base Color is required.';
      } else if (!productForm?.groupId) {
        message = 'Group is required.';
      } else if (!productForm?.origin) {
        message = 'Origin is required.';
      } else if (!productForm?.finishId) {
        message = 'Finish is required.';
      } else if (!productForm?.weight) {
        message = 'Weight is required.';
      } else if (!productForm?.thickness) {
        message = 'Thickness is required.';
      }
    } else if (!productForm?.uom) {
      message = 'Unit of measurement is required.';
    } else if (!productForm?.singleUnitPrice) {
      message = 'Single unit price is required.';
    } else if (!productForm?.bundlePrice) {
      message = 'Bundle price is required.';
    } else if (!productForm?.binId) {
      message = 'Time/Bin is required.';
    } else if (!productForm?.reorderQuantity) {
      message = 'Reorder quantity is required.';
    } else if (!productForm?.safetyQuantity) {
      message = 'Safety stock quantity is required.';
    } else if (!productForm?.leadTime) {
      message = 'Lead time is required.';
    }
    if (message) {
      showErrorToast(message);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      <BaseScreen scrollable={true} keyboardAware={true} style={{ flex: 1, marginBottom: 78 }}>
        <Heading4 style={{ paddingTop: theme.spacing.md, paddingHorizontal: theme.spacing.sm }}>
          Product Details
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Product Name'}
            placeholder={'Product Name'}
            value={productForm?.name}
            onChangeText={txt => updateForm('name', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Alternative Name'}
            placeholder={'Alternative Name'}
            value={productForm?.alternativeName}
            onChangeText={txt => updateForm('alternativeName', txt)}
          />
          <Dropdown
            options={
              generalData?.kind?.map(item => {
                return { label: item.value, value: item.id, id: item.id };
              }) ?? []
            }
            mandatory={true}
            placeholder={'Select Kind'}
            label={'Kind'}
            value={productForm?.kind}
            useBottomSheet={true}
            onSelectionChange={id => updateForm('kind', id as number)}
          />
          <Dropdown
            options={[
              { label: 'Slab', value: 'slab', id: 1 },
              { label: 'Generic', value: 'generic', id: 2 },
            ]}
            mandatory={true}
            placeholder={'Select Category'}
            label={'Category'}
            useBottomSheet={true}
            value={productForm?.categoryId}
            onSelectionChange={id => updateForm('categoryId', id as number)}
          />
          <Dropdown
            options={
              generalData?.productSubCategories
                ?.filter(subCat =>
                  productForm?.categoryId === 1 ? subCat.isSlabType : !subCat.isSlabType,
                )
                ?.map(item => {
                  return { label: item.name, value: item.id, id: item.id };
                }) ?? []
            }
            mandatory={true}
            placeholder={'Select Sub Category'}
            label={'Sub Category'}
            useBottomSheet={true}
            value={productForm?.subCategoryId}
            onSelectionChange={id => updateForm('subCategoryId', id)}
          />
          {productForm?.categoryId === 1 && (
            <View style={{ gap: theme.spacing.md }}>
              <Dropdown
                options={
                  generalData?.productColors?.map(item => {
                    return { label: item.name, value: item.id, id: item.id };
                  }) ?? []
                }
                mandatory={true}
                placeholder={'Select Color'}
                label={'Base Color'}
                value={productForm?.baseColorId}
                useBottomSheet={true}
                onSelectionChange={id => updateForm('baseColorId', id)}
              />

              <Dropdown
                options={
                  generalData?.group?.map(item => {
                    return { label: item.name, value: item.id, id: item.id };
                  }) ?? []
                }
                mandatory={true}
                placeholder={'Select Group'}
                label={'Group'}
                value={productForm?.groupId}
                useBottomSheet={true}
                onSelectionChange={id => updateForm('groupId', id)}
              />
            </View>
          )}
          <Dropdown
            options={
              generalData?.unitOfMeasurement?.map(item => {
                return { label: item.name, value: item.id, id: item.id };
              }) ?? []
            }
            mandatory={true}
            placeholder={'Select Unit of Measurement'}
            label={'Unit of Measurement'}
            useBottomSheet={true}
            value={productForm?.uom}
            disabled={true}
            onSelectionChange={id => updateForm('uom', id)}
          />
          {productForm?.categoryId === 1 && (
            <View style={{ gap: theme.spacing.md }}>
              <Dropdown
                options={
                  generalData?.countries?.map(item => {
                    return { label: item.name, value: item.id, id: item.id };
                  }) ?? []
                }
                mandatory={true}
                placeholder={'Select Origin'}
                label={'Origin'}
                useBottomSheet={true}
                value={productForm?.origin}
                onSelectionChange={id => updateForm('origin', id)}
              />
              <Dropdown
                options={
                  generalData?.finish?.map(item => {
                    return { label: item.name, value: item.id, id: item.id };
                  }) ?? []
                }
                mandatory={true}
                placeholder={'Select Finish'}
                label={'Finish'}
                useBottomSheet={true}
                value={productForm?.finishId}
                onSelectionChange={id => updateForm('finishId', id)}
              />
              <TextInput
                mandatory={true}
                label={'Weight'}
                placeholder={'Enter weight'}
                value={productForm?.weight}
                inputType={'number'}
                onChangeText={txt => updateForm('weight', txt)}
              />
              <Dropdown
                options={
                  generalData?.thickness?.map(item => {
                    return { label: item.value, value: item.id, id: item.id };
                  }) ?? []
                }
                mandatory={true}
                placeholder={'Select Thickness'}
                label={'Thickness'}
                useBottomSheet={true}
                value={productForm?.thickness}
                onSelectionChange={id => updateForm('thickness', id)}
              />
            </View>
          )}
          {/*<CheckBox*/}
          {/*  title={'This product is manufactured and not purchased from a supplier.'}*/}
          {/*  checked={true}*/}
          {/*  onChange={checked => {}}*/}
          {/*/>*/}
          {/*<CheckBox*/}
          {/*  title={'This product is a generic product.'}*/}
          {/*  checked={true}*/}
          {/*  onChange={checked => {}}*/}
          {/*/>*/}
          {/*<CheckBox*/}
          {/*  title={'Allow customers to select exact slab for this item.'}*/}
          {/*  checked={true}*/}
          {/*  onChange={checked => {}}*/}
          {/*/>*/}
          {/*<CheckBox*/}
          {/*  title={*/}
          {/*    'This product is Non-Serialized(Inventory for this product is not tracked by each purchased lot).'*/}
          {/*  }*/}
          {/*  checked={true}*/}
          {/*  onChange={checked => {}}*/}
          {/*/>*/}
          {/*<CheckBox*/}
          {/*  title={*/}
          {/*    'This product is Indivisible(Each detail line of this product received in a manufacture packing list can’t be partially sold).'*/}
          {/*  }*/}
          {/*  checked={true}*/}
          {/*  onChange={checked => {}}*/}
          {/*/>*/}
        </Card>
        <Heading4 style={{ paddingTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
          Selling Prices
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Single Unit Price'}
            placeholder={'Enter single unit price'}
            value={productForm?.singleUnitPrice}
            inputType={'number'}
            onChangeText={txt => updateForm('singleUnitPrice', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Bundle Price'}
            placeholder={'Enter bundle price'}
            inputType={'number'}
            value={productForm?.bundlePrice}
            onChangeText={txt => updateForm('bundlePrice', txt)}
          />
          <Dropdown
            options={
              bins?.map(item => {
                return { label: item.name, value: item.id, id: item.id };
              }) ?? []
            }
            mandatory={true}
            placeholder={'Select Time/Bin'}
            label={'Assigned Time/Bin'}
            useBottomSheet={true}
            onSelectionChange={id => updateForm('binId', id)}
            value={productForm?.binId}
          />
        </Card>
        <Heading4 style={{ paddingTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
          Default Affected Accounts
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <Dropdown
            mandatory={true}
            label={'GL Inventory Link Account'}
            placeholder={'Select Account'}
            useBottomSheet={true}
            disabled={true}
            value={defaultAccounts?.finishedGoodsAccount?.id ?? 0}
            options={[
              {
                label:
                  `${defaultAccounts?.finishedGoodsAccount?.code} - ${defaultAccounts?.finishedGoodsAccount?.name}` ??
                  'NA',
                value: defaultAccounts?.finishedGoodsAccount?.id ?? -1,
                id: defaultAccounts?.finishedGoodsAccount?.id ?? -1,
              },
            ]}
            onSelectionChange={_ => {}}
          />
          <Dropdown
            mandatory={true}
            label={'GL Income Account'}
            placeholder={'Select Account'}
            useBottomSheet={true}
            disabled={true}
            value={defaultAccounts?.goodsSoldAccount?.id ?? 0}
            options={[
              {
                label:
                  `${defaultAccounts?.goodsSoldAccount?.code} - ${defaultAccounts?.goodsSoldAccount?.name}` ??
                  'NA',
                value: defaultAccounts?.goodsSoldAccount?.id ?? -1,
                id: defaultAccounts?.goodsSoldAccount?.id ?? -1,
              },
            ]}
            onSelectionChange={_ => {}}
          />
          <Dropdown
            placeholder={'Select Account'}
            label={'GL Cost of Goods Account'}
            useBottomSheet={true}
            disabled={true}
            mandatory={true}
            value={defaultAccounts?.cogsAccount?.id ?? 0}
            options={[
              {
                label:
                  `${defaultAccounts?.cogsAccount?.code} - ${defaultAccounts?.cogsAccount?.name}` ??
                  'NA',
                value: defaultAccounts?.cogsAccount?.id ?? -1,
                id: defaultAccounts?.cogsAccount?.id ?? -1,
              },
            ]}
            onSelectionChange={_ => {}}
          />
        </Card>
        <Heading4 style={{ paddingTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
          Reorder Levels
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Reorder Qty'}
            value={productForm?.reorderQuantity}
            inputType={'number'}
            placeholder={'Enter reorder quantity'}
            onChangeText={txt => updateForm('reorderQuantity', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Safety Stock Qty'}
            value={productForm?.safetyQuantity}
            inputType={'number'}
            placeholder={'Enter safety stock quantity'}
            onChangeText={txt => updateForm('safetyQuantity', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Lead Time (in months)'}
            value={productForm?.leadTime}
            inputType={'number'}
            placeholder={'Enter lead time'}
            onChangeText={txt => updateForm('leadTime', txt)}
          />
        </Card>

        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            label={'Notes'}
            mandatory={true}
            multiline={true}
            value={productForm?.notes}
            placeholder={'Enter notes...'}
            onChangeText={txt => updateForm('notes', txt)}
          />
          <TextInput
            label={'Special Instructions'}
            multiline={true}
            mandatory={true}
            value={productForm?.instructions}
            placeholder={'Enter instructions...'}
            onChangeText={txt => updateForm('instructions', txt)}
          />
          <TextInput
            label={'Disclaimer'}
            mandatory={true}
            multiline={true}
            value={productForm?.disclaimer}
            placeholder={'Enter disclaimer...'}
            onChangeText={txt => updateForm('disclaimer', txt)}
          />
        </Card>
      </BaseScreen>
      <Button
        onPress={onSubmitClick}
        title={'Submit'}
        loading={loading}
        style={{
          position: 'absolute',
          bottom: theme.spacing.xl,
          start: 0,
          end: 0,
          marginHorizontal: theme.spacing.md,
        }}
        variant={'primary'}
      />
    </View>
  );
};

const style = StyleSheet.create({});
