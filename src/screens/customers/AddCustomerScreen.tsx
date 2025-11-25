import React, { useEffect } from 'react';
import theme from '../../theme';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Button from '../../components/ui/Button.tsx';
import { StyleSheet, View } from 'react-native';
import { Heading4, TextInput } from '../../components/ui';
import Card from '../../components/ui/Card.tsx';
import Dropdown from '../../components/ui/Dropdown.tsx';
import { useAppState } from '../../store/hooks.ts';
import { services } from '../../network';
import { showErrorToast, showSuccessToast } from '../../utils';
import { createObjectUpdater } from '../../utils/CommonUtility.ts';
import NavigationService from '../../navigation/NavigationService.ts';
import DatePicker from '../../components/ui/DatePicker.tsx';
import { CheckBox } from '../../components/ui/CheckBox.tsx';
import { VendorFilter } from '../../network/services/VendorService.ts';
import { Vendors } from '../../types/VendorTypes.ts';
import { Autocomplete } from '../../components/ui/Autocomplete.tsx';
import GooglePlacesSDK from 'react-native-google-places-sdk';
import { AutocompletePlace } from '../../types/CommonTypes.ts';
import type { PlacePrediction } from 'react-native-google-places-sdk/src/types.ts';
import { useDebounce, useDebouncedCallback } from '../../hooks/useDebounce.ts';

export type AddVendorForm = {
  name: string;
  code?: string;
  vendorScope: number;
  contactName?: string;
  parentLocation: number;
  paymentTerms?: number;
  printName: string;
  language: number;
  parentSupplier?: string;
  vendorSince?: Date;
  port?: string;
  markupMultiplier?: string;
  discount?: string;
  primaryPhoneNo: string;
  secondaryPhoneNo: string;
  landlineNo?: string;
  email: string;
  accountingEmail?: string;
  remitAddress?: string;
  remitSuite?: string;
  remitCity?: string;
  remitState?: string;
  remitZip?: string;
  remitCountry?: number;
  shippingAddress?: string;
  shippingSuite?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZip?: string;
  shippingCountry?: 77;
  deliveryNotes?: string;
  internalNotes?: string;
  type: 'SUPPLIER';
};

type VendorFormErrors = {
  [key: string]: string;
};

export const AddCustomerScreen: React.FC = () => {
  const { generalData, allLocations } = useAppState();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [vendorForm, setVendorForm] = React.useState<AddVendorForm>();
  const [vendors, setVendors] = React.useState<Vendors>([]);
  const [shippingSameAsRemit, setShippingSameAsRemit] = React.useState<Boolean>(false);
  const [errors, setErrors] = React.useState<VendorFormErrors>({});
  const [addressQuery, setAddressQuery] = React.useState<string>('');
  const [addressPredictions, setAddressPredictions] = React.useState<PlacePrediction[]>([]);

  const updateForm = createObjectUpdater(setVendorForm);

  useEffect(() => {
    getSuppliers({ type: 'SUPPLIER' });
  }, []);

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

  const onSubmitClick = () => {
    const isValid = validateForm();
    if (isValid) {
      addVendor({ ...vendorForm, type: 'SUPPLIER' });
    }
  };

  const fetchPlaces = async (input: string) => {
    GooglePlacesSDK.fetchPredictions(input)
      .then(predictions => setAddressPredictions(predictions))
      .catch(error => console.log(error));
  };

  const debouncedSearch = useDebouncedCallback((text: string) => {
    fetchPlaces(text);
  }, 1000);

  const addVendor = async (addVendorForm: AddVendorForm) => {
    setLoading(true);
    const response = await services.vendors.addVendor(addVendorForm);
    if (response.success) {
      showSuccessToast(response.data?.message ?? 'Supplier added successfully');
      NavigationService.goBack();
    } else {
      showErrorToast(response.error?.message[0] || 'Failed to add supplier');
    }
    setLoading(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!vendorForm?.name?.trim()) newErrors.name = 'Name is required';
    if (!vendorForm?.printName?.trim()) newErrors.printName = 'Print name is required';
    if (!vendorForm?.parentLocation) newErrors.parentLocation = 'Parent location is required';
    if (!vendorForm?.primaryPhoneNo?.trim())
      newErrors.primaryPhoneNo = 'Primary phone number is required';
    if (!vendorForm?.email?.trim()) newErrors.email = 'Email address is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length == 0) {
      return true;
    } else {
      showErrorToast('Please fix the errors in the form before submitting.');
    }
    return false;
  };

  return (
    <View style={{ flex: 1 }}>
      <BaseScreen scrollable={true} keyboardAware={true} style={{ flex: 1, marginBottom: 78 }}>
        <Heading4 style={{ paddingTop: theme.spacing.md, paddingHorizontal: theme.spacing.sm }}>
          Supplier Details
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Customer Name'}
            placeholder={'Enter customer name'}
            value={vendorForm?.name}
            error={errors.name}
            onChangeText={txt => {
              setErrors({ ...errors, name: '' });
              updateForm('name', txt);
            }}
          />
          <Dropdown
            options={
              generalData?.scope?.map(item => {
                return { label: item.value, value: item.id, id: item.id };
              }) ?? []
            }
            mandatory={true}
            placeholder={'Select customer type'}
            label={'Customer Type'}
            value={vendorForm?.vendorScope}
            useBottomSheet={true}
            onSelectionChange={id => updateForm('vendorScope', id as number)}
          />
          <TextInput
            mandatory={true}
            label={'Contact Name'}
            placeholder={'Enter contact name'}
            value={vendorForm?.code}
            onChangeText={txt => updateForm('code', txt)}
          />

          <TextInput
            mandatory={true}
            label={'Print Name'}
            placeholder={'Enter print name'}
            value={vendorForm?.contactName}
            onChangeText={txt => updateForm('contactName', txt)}
          />
          <Dropdown
            options={
              allLocations?.map(item => {
                return { label: item.location, value: item.id, id: item.id };
              }) ?? []
            }
            mandatory={true}
            placeholder={'Select parent customer'}
            label={'Parent Customer'}
            useBottomSheet={true}
            value={vendorForm?.parentLocation}
            onSelectionChange={id => updateForm('parentLocation', id as number)}
          />
          <DatePicker
            mode={'date'}
            label={'Customer Since'}
            value={vendorForm?.vendorSince}
            placeholder={'Select a date'}
            onChange={date => {
              updateForm('vendorSince', date);
            }}
          />
        </Card>
        <Heading4 style={{ paddingTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
          Contact information
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Primary Phone No.'}
            placeholder={'Enter primary phone number'}
            value={vendorForm?.primaryPhoneNo}
            inputType={'phone'}
            error={errors.primaryPhoneNo}
            onChangeText={txt => {
              setErrors({ ...errors, primaryPhoneNo: '' });
              updateForm('primaryPhoneNo', txt);
            }}
          />
          <TextInput
            mandatory={true}
            label={'Secondary Phone No.'}
            placeholder={'Enter secondary phone number'}
            inputType={'phone'}
            value={vendorForm?.secondaryPhoneNo}
            onChangeText={txt => updateForm('secondaryPhoneNo', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Landline No.'}
            placeholder={'Enter landline number'}
            inputType={'phone'}
            value={vendorForm?.landlineNo}
            onChangeText={txt => updateForm('landlineNo', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Email'}
            placeholder={'Enter email address'}
            inputType={'email'}
            value={vendorForm?.email}
            error={errors.email}
            onChangeText={txt => {
              setErrors({ ...errors, email: '' });
              updateForm('email', txt);
            }}
          />
          <TextInput
            mandatory={true}
            label={'Accounting Email'}
            placeholder={'Enter accounting email address'}
            inputType={'email'}
            value={vendorForm?.accountingEmail}
            onChangeText={txt => updateForm('accountingEmail', txt)}
          />
        </Card>
        <Heading4 style={{ paddingTop: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}>
          Bill to Address
        </Heading4>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <Autocomplete
            inputProps={{
              label: 'Location',
              placeholder: 'Search parent location',
            }}
            items={addressPredictions.map(prediction => ({
              id: prediction.placeID,
              label: prediction.primaryText,
              value: prediction.primaryText,
            }))}
            onTextChange={debouncedSearch}
            onSelected={item => {}}
          />
          <TextInput
            mandatory={true}
            label={'Address'}
            placeholder={'Enter address'}
            value={vendorForm?.remitAddress}
            inputType={'text'}
            onChangeText={txt => updateForm('remitAddress', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Suit/Unit#'}
            placeholder={'Enter suit or unit number'}
            inputType={'text'}
            value={vendorForm?.remitSuite}
            onChangeText={txt => updateForm('remitSuite', txt)}
          />
          <TextInput
            mandatory={true}
            label={'City'}
            placeholder={'Enter city'}
            inputType={'text'}
            value={vendorForm?.remitCity}
            onChangeText={txt => updateForm('remitCity', txt)}
          />
          <TextInput
            mandatory={true}
            label={'State'}
            placeholder={'Enter state'}
            inputType={'text'}
            value={vendorForm?.remitState}
            onChangeText={txt => updateForm('remitState', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Zip Code'}
            placeholder={'Enter zip code'}
            inputType={'number'}
            value={vendorForm?.remitZip}
            onChangeText={txt => updateForm('remitZip', txt)}
          />
          <Dropdown
            placeholder={'Select country'}
            label={'Country'}
            useBottomSheet={true}
            mandatory={true}
            value={vendorForm?.remitCountry ?? 0}
            options={
              generalData?.countries?.map(item => {
                return { label: item.name, value: item.id, id: item.id };
              }) ?? []
            }
            onSelectionChange={id => updateForm('remitCountry', id)}
          />
        </Card>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            paddingHorizontal: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
          }}>
          <Heading4>Shipping Address</Heading4>
          <CheckBox
            title={'Same as Remit Address'}
            checked={shippingSameAsRemit.valueOf()}
            onChange={checked => {
              setShippingSameAsRemit(checked);
            }}
          />
        </View>
        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            mandatory={true}
            label={'Address'}
            placeholder={'Enter address'}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitAddress : vendorForm?.shippingAddress}
            inputType={'text'}
            onChangeText={txt => updateForm('shippingAddress', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Suit/Unit#'}
            placeholder={'Enter suit or unit number'}
            inputType={'text'}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitSuite : vendorForm?.shippingSuite}
            onChangeText={txt => updateForm('shippingSuite', txt)}
          />
          <TextInput
            mandatory={true}
            label={'City'}
            placeholder={'Enter city'}
            inputType={'text'}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitCity : vendorForm?.shippingCity}
            onChangeText={txt => updateForm('shippingCity', txt)}
          />
          <TextInput
            mandatory={true}
            label={'State'}
            placeholder={'Enter state'}
            inputType={'text'}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitState : vendorForm?.shippingState}
            onChangeText={txt => updateForm('shippingState', txt)}
          />
          <TextInput
            mandatory={true}
            label={'Zip Code'}
            placeholder={'Enter zip code'}
            inputType={'number'}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitZip : vendorForm?.shippingZip}
            onChangeText={txt => updateForm('shippingZip', txt)}
          />
          <Dropdown
            placeholder={'Select country'}
            label={'Country'}
            useBottomSheet={true}
            mandatory={true}
            disabled={shippingSameAsRemit.valueOf()}
            value={shippingSameAsRemit ? vendorForm?.remitCountry : vendorForm?.shippingCountry}
            options={
              generalData?.countries?.map(item => {
                return { label: item.name, value: item.id, id: item.id };
              }) ?? []
            }
            onSelectionChange={id => updateForm('shippingCountry', id)}
          />
        </Card>

        <Card style={{ gap: theme.spacing.md, margin: theme.spacing.sm }}>
          <TextInput
            label={'Delivery Notes'}
            mandatory={true}
            multiline={true}
            value={vendorForm?.deliveryNotes}
            placeholder={'Enter your text here...'}
            onChangeText={txt => updateForm('deliveryNotes', txt)}
          />
          <TextInput
            label={'Internal Notes'}
            multiline={true}
            mandatory={true}
            value={vendorForm?.internalNotes}
            placeholder={'Enter your text here...'}
            onChangeText={txt => updateForm('internalNotes', txt)}
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
