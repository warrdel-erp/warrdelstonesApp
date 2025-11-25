import React, { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { Heading4, Heading5, ImageLoader, LabelValue } from '../../components/ui';
import theme from '../../theme';
import Card from '../../components/ui/Card.tsx';
import { ProductDetail, ProductDetailResponse } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { services } from '../../network';
import { ScreenProps } from '../../types/NavigationTypes.ts';
import Container from '../../components/ui/Container.tsx';
import Geocoder from 'react-native-geocoder';
import Config from 'react-native-config';
import IconButton from '../../components/ui/IconButton.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';

export type ProductDetailScreenProps = ScreenProps<{ productId: number }>;
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = props => {
  const productId = props.route.params?.productId;
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
      <Container
        padding={'sm'}
        style={{ gap: theme.spacing.md, backgroundColor: theme.colors.background }}>
        <Card key={productDetail.id.toString()} style={{ backgroundColor: theme.colors.surface }}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            <ImageLoader
              showLoadingIndicator={false}
              source={
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiHrQZIt3akt3HRkbXTcdtFRMnLNIwI7_0dQ&s'
              }
            />
            <View style={{ flexDirection: 'row', flex: 1, alignContent: 'space-between' }}>
              <View>
                <Heading4>{productDetail.name}</Heading4>
                <LabelValue label={'Kind:'} value={productDetail.kind} />
                <LabelValue label={'Category:'} value={productDetail.category?.name ?? '--'} />
                <LabelValue label={'Subcategory:'} value={productDetail.subCategory.name} />
                <LabelValue label={'Color:'} value={productDetail.baseColor?.name ?? 'NA'} />
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <IconButton
                  iconName={'share'}
                  size={'extraSmall'}
                  variant={'plain'}
                  outlineColor={theme.colors.primary}
                  onPress={() => {}}
                />
                <IconButton
                  iconName={'edit'}
                  size={'extraSmall'}
                  variant={'plain'}
                  outlineColor={theme.colors.primary}
                  onPress={() => {}}
                />
                <IconButton
                  iconName={'print'}
                  size={'extraSmall'}
                  variant={'plain'}
                  outlineColor={theme.colors.primary}
                  onPress={() => {}}
                />
                <IconButton
                  iconName={'stacked-bar-chart'}
                  size={'extraSmall'}
                  variant={'plain'}
                  outlineColor={theme.colors.primary}
                  onPress={() => {}}
                />
              </View>
            </View>
          </View>
        </Card>

        <Card>
          <View>
            <LabelValue
              label={'GL Inventory Link Account:'}
              value={`${productDetail.inventoryLinkAccount?.code} - ${productDetail.inventoryLinkAccount?.name}`}
            />
            <LabelValue
              label={'GL Income Account:'}
              value={`${productDetail.incomeAccount?.code} - ${productDetail.incomeAccount?.name}`}
            />
            <LabelValue
              label={'GL Cost of Goods Sold Account:'}
              value={`${productDetail.costOfGoodsAccount?.code} - ${productDetail.costOfGoodsAccount?.name}`}
            />
          </View>
        </Card>
        <View style={{ gap: theme.spacing.xs }}>
          <Heading5>Selling Price</Heading5>
          <Card>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue
                containerStyle={{ flex: 1 }}
                label={'Single Slab Price:'}
                value={`${productDetail.singleUnitPrice ?? '-'}`}
              />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'Bundle Price:'}
                value={`${productDetail.bundlePrice}`}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue
                containerStyle={{ flex: 1 }}
                label={'Avg. Landed Cost:'}
                value={`${(Number(productDetail.avgLandedCost ?? '0') * 144).toFixed(2) ?? '-'}`}
              />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'Last Landed Cost:'}
                value={`${productDetail.avgLandedCost ?? 'NA'}`}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue containerStyle={{ flex: 1 }} label={'Last FOB Cost:'} value={`NA`} />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'FOB Cost:'}
                value={`NA`}
              />
            </View>
          </Card>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <Heading5>Inventory Balance</Heading5>
          <Card>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue
                containerStyle={{ flex: 1 }}
                valueStyle={{ color: theme.colors.status.info }}
                label={'In Stock:'}
                value={`${productDetail?.inventoryBalance?.inStock[0]?.count || 0} Slabs`}
              />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'Area:'}
                value={`${productDetail?.inventoryBalance?.inStock[0]?.area || 0} ${productDetail.uom}`}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue
                containerStyle={{ flex: 1 }}
                valueStyle={{ color: theme.colors.status.warning }}
                label={'Slabs on hold:'}
                value={`${productDetail?.inventoryBalance?.allocatedHold[0]?.count || 0} Slabs`}
              />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'Area:'}
                value={`${productDetail?.inventoryBalance?.allocatedHold[0]?.area || 0} ${productDetail.uom}`}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <LabelValue
                containerStyle={{ flex: 1 }}
                valueStyle={{ color: theme.colors.status.success }}
                label={'Available Slabs:'}
                value={`${productDetail?.inventoryBalance?.available[0]?.count || 0} Slabs`}
              />
              <LabelValue
                containerStyle={{ flex: 1 }}
                alignment={'right'}
                label={'Area:'}
                value={`${productDetail?.inventoryBalance?.available[0]?.area || 0} ${productDetail.uom}`}
              />
            </View>
            <LabelValue label={'Weight:'} value={`${productDetail?.weight ?? 'NA'}`} />
            <LabelValue label={'Thickness:'} value={`${productDetail?.thickness ?? 'NA'}`} />
          </Card>
        </View>

        <View style={{ gap: theme.spacing.xs }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <Heading5>Origin:</Heading5>
            <Heading4>{productDetail.origin.name ?? '--'}</Heading4>
          </View>
          {locationUrl && (
            <Card style={{ padding: 0 }}>
              <ImageLoader
                showLoadingIndicator={false}
                width={Dimensions.get('window').width - 2 * theme.spacing.sm}
                height={200}
                source={locationUrl}
              />
            </Card>
          )}
        </View>
      </Container>
    );
  };

  return (
    <BaseScreen
      scrollable={true}
      keyboardAware={true}
      style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {loading && <ScreenLoadingIndicator title={'Loading Details...'} />}
      {!loading && productDetails?.data && renderProductDetails(productDetails.data)}
    </BaseScreen>
  );
};

export default ProductDetailScreen;
