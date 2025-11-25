import React, { useEffect } from 'react';
import { ScreenProps } from '../../types/NavigationTypes.ts';
import { BodyText, Button, Heading4, Heading5, LabelValue } from '../../components/ui';
import { Block, Inventory, Slab, SlabStatus } from '../../types/InventoryTypes.ts';
import theme from '../../theme';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { ScrollView, Switch, View } from 'react-native';
import Card from '../../components/ui/Card.tsx';
import Container from '../../components/ui/Container.tsx';
import { createShortForm } from '../../utils/CommonUtility.ts';
import StatusBadge from '../../components/ui/StatusBadge.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import { services } from '../../network';

export type BlockSlabsListScreenProps = ScreenProps<{
  blockId: string,
  inventory: Inventory
}>

export const BlockSlabsListScreen: React.FC<BundleSlabsListScreenProps> = (props) => {
  const { blockId, inventory } = props.route.params
  const [slabs, setSlabs] = React.useState<Slab[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    setSlabs(inventory.blocks.find(b => b.block === blockId)?.slabs ?? [])
  }, [blockId]);


  const statusLabel = (status: SlabStatus) => {
    switch (status) {
      case 'INITIATE':
        return 'Initiate'
      case 'IN_INVENTORY':
        return 'In Inventory'
      case 'ALLOCATED':
        return 'Allocated'
      case 'SOLD':
        return 'Sold'
      default:
        return status
    }
  }

  const statusTxt = (status: SlabStatus) => {
    switch (status) {
      case 'INITIATE':
        return 'info'
      case 'IN_INVENTORY':
        return 'success'
      case 'ALLOCATED':
        return 'warning'
      case 'SOLD':
        return 'error'
      default:
        return status
    }
  }

  const toggleHold = async (slabId: number, isHold: boolean) => {
    try {
      setLoading(true)
      const response = await services.inventory.toggleSlabOnHold(slabId, isHold)
      if (response.success) {
        const updatedSlabs = slabs.map(slab => {
          if (slab.id === slabId) {
            return { ...slab, isHold: isHold };
          }
          return slab;
        });
        setSlabs(updatedSlabs);
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to update hold status')
      }
    } catch (e) {
      showErrorToast('Failed to update hold status');
    } finally {
      setLoading(false)
    }

  }

  const toggleCart = async (slabId: number, isInCart: boolean) => {
    try {
      setLoading(true)
      const response = await services.inventory.addToCart(slabId, !isInCart)
      if (response.success){
        const updatedSlabs = slabs.map(slab => {
          if (slab.id === slabId) {
            return { ...slab, inventoryProduct: { ...slab.inventoryProduct, isInCart: !isInCart } };
          }
          return slab;
        });
        setSlabs(updatedSlabs);
      } else {
        showErrorToast(response.error?.message[0] ?? 'Failed to add to cart')
      }
    } catch (error) {
      showErrorToast('Failed to update cart status');
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        key={inventory.id.toString()}
        style={{
          backgroundColor: theme.colors.surface,
          padding: theme.spacing.sm,
          ...theme.shadows.md,
        }}
        onClick={() => {
          NavigationService.navigate(ScreenId.PRODUCT_DETAIL, { productId: inventory.id });
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: theme.spacing.sm,
            alignItems: 'baseline',
          }}>
          <Heading4>{inventory.name}</Heading4>
          <LabelValue containerStyle={{ flex: 1 }} label={'from'} value={inventory.origin} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <LabelValue containerStyle={{ flex: 1 }} label={'Kind:'} value={inventory.kind} />
          <LabelValue
            containerStyle={{ flex: 1 }}
            alignment={'right'}
            label={'Subcategory:'}
            value={inventory.subCategory.name}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <LabelValue
            containerStyle={{ flex: 1 }}
            label={'Color:'}
            value={inventory.baseColor?.name ?? 'NA'}
          />
          <LabelValue
            containerStyle={{ flex: 1 }}
            label={'Group:'}
            alignment={'right'}
            value={inventory.group?.name ?? 'NA'}
          />
        </View>
      </View>
      <Container>
        <Heading5>Slabs in Block - {blockId}</Heading5>
      </Container>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.sm,
          paddingBottom: theme.spacing.lg,
        }}>
        {slabs.map(slab => (
          <Card
            key={slab.id.toString()}
            style={{ backgroundColor: theme.colors.surface, marginBottom: theme.spacing.sm }}>
            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.sm,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
                <LabelValue
                  fullWidth={false}
                  label={'Serial No.:'}
                  value={slab.inventoryProduct.combinedNumber}
                />
                <LabelValue fullWidth={false} label={'Barcode:'} value={slab.barcode} />
              </View>
              <StatusBadge
                status={statusTxt(slab.status)}
                text={statusLabel(slab.status)}
                size={'extraSmall'}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
              <LabelValue fullWidth={false} label={'Block:'} value={slab.block} />
              <LabelValue fullWidth={false} label={'Bundle:'} value={slab.lot} />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
              <LabelValue fullWidth={false} label={'Slab:'} value={slab.slabNumber} />
              <LabelValue fullWidth={false} label={'Bin:'} value={slab.inventoryProduct.bin.name} />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
              <LabelValue
                fullWidth={false}
                label={'Landed Cost:'}
                value={`${Number(slab?.landedUnitCost * 144).toFixed(2)}/${createShortForm(inventory.uom)}`}
              />
              <LabelValue
                fullWidth={false}
                label={'Selling Cost:'}
                value={`${Number(slab?.inventoryProduct?.sellingPrice).toFixed(2)}/${createShortForm(inventory.uom)}`}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
              <LabelValue
                fullWidth={false}
                label={'On hold:'}
                value={`${slab?.receivingLength} x ${slab?.receivingWidth} = ${((slab?.receivingLength * slab?.receivingWidth) / 144).toFixed(3)} ${createShortForm(inventory.uom)}`}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: theme.spacing.sm,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <LabelValue
                fullWidth={false}
                label={'Warehouse:'}
                value={slab?.inventoryProduct?.bin?.warehouse?.location?.location}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <BodyText style={{ marginRight: theme.spacing.sm }}>On Hold</BodyText>
                <Switch
                  value={slab.isHold}
                  onValueChange={() => toggleHold(slab.id, !slab.isHold)}
                />
              </View>
            </View>
            <View style={{ marginTop: theme.spacing.sm }}>
              <Button
                title={slab.inventoryProduct.isInCart ? 'Remove from cart' : 'Add to cart'}
                size={'small'}
                variant={'outline'}
                onPress={() => toggleCart(slab.id, slab.inventoryProduct.isInCart)}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
      {loading && <ScreenLoadingIndicator />}
    </View>
  );
}