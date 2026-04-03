import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Config from 'react-native-config';
import Geocoder from 'react-native-geocoder';
import { XStack, YStack, getTokens, useTheme } from 'tamagui';
import { Heading, ImageLoader } from '../../components/ui';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import CardWithHeader from '../../components/ui/CardWithHeader';
import DetailGridRenderer from '../../components/ui/DetailGridRenderer';
import IconButton from '../../components/ui/IconButton.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { services } from '../../network';
import { ProductDetail, ProductDetailResponse } from '../../types/InventoryTypes.ts';
import { ScreenProps } from '../../types/NavigationTypes.ts';
import { showErrorToast } from '../../utils';

export type ProductDetailScreenProps = ScreenProps<{ productId: number }>;
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = props => {
  const productId = props.route.params?.productId;
  const tamaguiTheme = useTheme();
  const tokens = getTokens();
  const [productDetails, setProductDetails] = React.useState<ProductDetailResponse | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState<boolean>(false);
  const [locationUrl, setLocationUrl] = React.useState<string | null>(null);

  useEffect(() => {
    getProductDetails();
  }, [productId]);

  useEffect(() => {
    if (productDetails?.data?.origin) {
      getLatLng(productDetails.data.origin.name);
    }
  }, [productDetails]);

  const getProductDetails = async () => {
    setLoading(true);
    try {
      const response = await services.inventory.getProduct(productId);
      if (response.success) {
        setProductDetails(response.data);
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to fetch product details');
      }
    } catch (error) {
      showErrorToast('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const getLatLng = async (address: string) => {
    try {
      const res = await Geocoder.geocodeAddress(address);
      if (res.length > 0) {
        const { lat, lng } = res[0].position;
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=1&size=${Dimensions.get('window').width}x${200}&markers=color:red%7Clabel:o%7C${lat},${lng}&key=${Config.GOOGLE_MAPS_API_KEY}`;
        setLocationUrl(url);
      } else {
        console.warn('No results found for the given address.');
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
    }
  };

  const renderProductDetails = (productDetail: ProductDetail) => {
    return (
      <YStack
        padding={tokens.space[2].val}
        gap={tokens.space[4].val}
        backgroundColor={tamaguiTheme.background?.val}>
        <CardWithHeader
          title={
            <Heading
              level={4}
              icon="Package"
              iconColor={tamaguiTheme.primary?.val}
              subheading={`from ${productDetail.origin?.name ?? '--'}`}>
              {productDetail.name}
            </Heading>
          }
          customActions={
            <XStack gap={tokens.space[2].val}>
              <IconButton
                iconName={'share'}
                size={'extraSmall'}
                variant={'plain'}
                outlineColor={tamaguiTheme.primary?.val}
                onPress={() => { }}
              />
              <IconButton
                iconName={'edit'}
                size={'extraSmall'}
                variant={'plain'}
                outlineColor={tamaguiTheme.primary?.val}
                onPress={() => { }}
              />
              <IconButton
                iconName={'print'}
                size={'extraSmall'}
                variant={'plain'}
                outlineColor={tamaguiTheme.primary?.val}
                onPress={() => { }}
              />
              <IconButton
                iconName={'stacked-bar-chart'}
                size={'extraSmall'}
                variant={'plain'}
                outlineColor={tamaguiTheme.primary?.val}
                onPress={() => { }}
              />
            </XStack>
          }>
          <XStack gap={tokens.space[4].val}>
            <ImageLoader
              showLoadingIndicator={false}
              source={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiHrQZIt3akt3HRkbXTcdtFRMnLNIwI7_0dQ&s'
              }
              width={100}
              height={100}
            />
            <DetailGridRenderer
              containerProps={{ flex: 1 }}
              items={[
                { label: 'Kind', value: productDetail.kind?.value, width: '45%' },
                { label: 'Category', value: productDetail.category?.name ?? '--', width: '45%' },
                { label: 'Subcategory', value: productDetail.subCategory.name, width: '45%' },
                { label: 'Color', value: productDetail.baseColor?.name ?? 'NA', width: '45%' },
              ]}
              gap={tokens.space[2].val}
            />
          </XStack>
        </CardWithHeader>

        <CardWithHeader title="GL Accounts">
          <DetailGridRenderer
            items={[
              {
                label: 'Inventory Link Account',
                value: `${productDetail.inventoryLinkAccount?.code} - ${productDetail.inventoryLinkAccount?.name}`,
                width: '45%',
              },
              {
                label: 'Income Account',
                value: `${productDetail.incomeAccount?.code} - ${productDetail.incomeAccount?.name}`,
                width: '45%',
              },
              {
                label: 'Cost of Goods Sold Account',
                value: `${productDetail.costOfGoodsAccount?.code} - ${productDetail.costOfGoodsAccount?.name}`,
                width: '45%',
              },
            ]}
          />
        </CardWithHeader>

        <CardWithHeader title="Selling Price">
          <DetailGridRenderer
            items={[
              {
                label: 'Single Slab Price',
                value: `${productDetail.singleUnitPrice ?? '-'}`,
                width: '45%',
              },
              {
                label: 'Bundle Price',
                value: `${productDetail.bundlePrice}`,
                width: '45%',
              },
              {
                label: 'Avg. Landed Cost',
                value: `${(Number(productDetail.avgLandedCost ?? '0') * 144).toFixed(2) ?? '-'}`,
                width: '45%',
              },
              {
                label: 'Last Landed Cost',
                value: `${productDetail.avgLandedCost ?? 'NA'}`,
                width: '45%',
              },
              {
                label: 'Last FOB Cost',
                value: 'NA',
                width: '45%',
              },
              {
                label: 'FOB Cost',
                value: 'NA',
                width: '45%',
              },
            ]}
          />
        </CardWithHeader>

        <CardWithHeader title="Inventory Balance">
          <DetailGridRenderer
            items={[
              {
                label: 'In Stock',
                value: `${productDetail?.inventoryBalance?.inStock?.[0]?.count || 0} Slabs`,
                width: '45%',
                valueStyle: { color: tamaguiTheme.statusInfo?.val },
              },
              {
                label: 'Area',
                value: `${productDetail?.inventoryBalance?.inStock?.[0]?.area || 0} ${productDetail.uom}`,
                width: '45%',
              },
              {
                label: 'Slabs on hold',
                value: `${productDetail?.inventoryBalance?.allocatedHold?.[0]?.count || 0} Slabs`,
                width: '45%',
                valueStyle: { color: tamaguiTheme.statusWarning?.val },
              },
              {
                label: 'Area',
                value: `${productDetail?.inventoryBalance?.allocatedHold?.[0]?.area || 0} ${productDetail.uom}`,
                width: '45%',
              },
              {
                label: 'Available Slabs',
                value: `${productDetail?.inventoryBalance?.available?.[0]?.count || 0} Slabs`,
                width: '45%',
                valueStyle: { color: tamaguiTheme.statusSuccess?.val },
              },
              {
                label: 'Area',
                value: `${productDetail?.inventoryBalance?.available?.[0]?.area || 0} ${productDetail.uom}`,
                width: '45%',
              },
              {
                label: 'Weight',
                value: `${productDetail?.weight ?? 'NA'}`,
                width: '45%',
              },
              {
                label: 'Thickness',
                value: `${productDetail?.thickness ?? 'NA'}`,
                width: '45%',
              },
            ]}
          />
        </CardWithHeader>

        {locationUrl && (
          <CardWithHeader title={`Origin: ${productDetail.origin.name ?? '--'}`} containerProps={{ padding: 0 }}>
            <ImageLoader
              showLoadingIndicator={false}
              width={Dimensions.get('window').width - 2 * tokens.space[2].val}
              height={200}
              source={locationUrl}
            />
          </CardWithHeader>
        )}
      </YStack>
    );
  };

  return (
    <BaseScreen
      scrollable={true}
      keyboardAware={true}
      style={{ flex: 1, backgroundColor: tamaguiTheme.background?.val }}>
      {loading && <ScreenLoadingIndicator title={'Loading Details...'} />}
      {!loading && productDetails?.data && renderProductDetails(productDetails.data)}
    </BaseScreen>
  );
};

export default ProductDetailScreen;
