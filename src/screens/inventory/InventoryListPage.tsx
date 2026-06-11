import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { BodyText, Heading5 } from '../../components/ui';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { useAppDispatch, useAppState, useInventory } from '../../store/hooks.ts';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import theme from '../../theme';
import { Inventory, SiplElement, Bundle, Block } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { InventoryProductsModal } from './InventoryProductsModal.tsx';
import { GetProductBy } from '../../network/services/InventoryService.ts';

export type InventoryTabType = 'BUNDLE' | 'BLOCK' | 'SIPL';

export interface InventoryListPageProps {
  type: InventoryTabType;
}

export const InventoryListPage: React.FC<InventoryListPageProps> = ({ type }) => {
  const dispatch = useAppDispatch();
  const { selectedLocation } = useAppState();
  const { inventory, loading, error } = useInventory();
  
  // Track expanded product ID for accordion
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  
  // Track selected child for modal
  const [modalFilter, setModalFilter] = useState<GetProductBy | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  useFocusEffect(
    React.useCallback(() => {
      if (selectedLocation) {
        dispatch(
          getInventory({ locationId: selectedLocation.id, params: { page: 1, limit: 2000, categorization: type } }),
        );
      }
      return () => {};
    }, [selectedLocation, dispatch, type]),
  );

  useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  const ItemSeparator = () => <View style={{ height: 16 }} />;

  const toggleExpand = (productId: number) => {
    setExpandedProductId(prev => prev === productId ? null : productId);
  };

  const openModal = (filter: GetProductBy, title: string) => {
    setModalFilter(filter);
    setModalTitle(title);
  };

  const renderChildren = (item: Inventory) => {
    if (type === 'BUNDLE' && item.bundles?.length > 0) {
      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{item.bundles.length} Bundle{item.bundles.length !== 1 ? 's' : ''}</BodyText>
          {item.bundles.map((bundle, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ bundle: bundle.bundle }, `Products - Bundle: ${bundle.bundle}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <Icon name="layers" size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{bundle.bundle || 'Unnamed'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{bundle.slabs?.length || 0}</BodyText>
                  <BodyText style={styles.childStatLabel}> units</BodyText>
                </View>
                <View style={styles.childDivider} />
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{bundle.totalQuantity || '0.00'}</BodyText>
                  <BodyText style={styles.childStatLabel}> sqft</BodyText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'BLOCK' && item.blocks?.length > 0) {
      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{item.blocks.length} Block{item.blocks.length !== 1 ? 's' : ''}</BodyText>
          {item.blocks.map((block, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ block: block.block }, `Products - Block: ${block.block}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <Icon name="view-in-ar" size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{block.block || 'Unnamed'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{block.slabs?.length || 0}</BodyText>
                  <BodyText style={styles.childStatLabel}> units</BodyText>
                </View>
                <View style={styles.childDivider} />
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{block.totalQuantity || '0.00'}</BodyText>
                  <BodyText style={styles.childStatLabel}> sqft</BodyText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'SIPL' && item.sipls?.length > 0) {
      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{item.sipls.length} SIPL Record{item.sipls.length !== 1 ? 's' : ''}</BodyText>
          {item.sipls.map((spl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ siplId: spl.id }, `Products - SIPL: ${spl.invoiceCode}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <Icon name="receipt-long" size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{spl.invoiceCode || 'No Invoice'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{spl.inventoryProducts?.length || 0}</BodyText>
                  <BodyText style={styles.childStatLabel}> units</BodyText>
                </View>
                <View style={styles.childDivider} />
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{((spl.totalArea ?? 0) / 144).toFixed(2)}</BodyText>
                  <BodyText style={styles.childStatLabel}> sqft</BodyText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return null;
  };

  const renderInventoryItem = (listData: ListRenderItemInfo<Inventory>) => {
    const { item } = listData;
    const isExpanded = expandedProductId === item.id;

    return (
      <View style={styles.cardContainer}>
        {/* Product Card Header (Touchable for expansion) */}
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
          style={styles.cardHeaderArea}>
          
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleWrap}>
              <Heading5 style={styles.productName} numberOfLines={1}>{item.name}</Heading5>
              <View style={styles.originWrap}>
                {item.origin && (
                  <BodyText style={styles.originText}>Origin {item.origin.name}</BodyText>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.badge}>
                <BodyText style={styles.badgeText}>{(item.kind as any)?.value || 'N/A'}</BodyText>
              </View>
              <TouchableOpacity
                onPress={() => NavigationService.navigate(ScreenId.PRODUCT_DETAIL, { productId: item.id })}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="info-outline" size={24} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {item.subCategory?.name && (
              <View style={styles.tag}>
                <BodyText style={styles.tagText}>{item.subCategory.name}</BodyText>
              </View>
            )}
            {item.baseColor?.name && (
              <View style={[styles.tag, styles.tagColor]}>
                <BodyText style={[styles.tagText, styles.tagTextColor]}>{item.baseColor.name}</BodyText>
              </View>
            )}
            {item.group?.name && (
              <View style={[styles.tag, styles.tagGroup]}>
                <BodyText style={[styles.tagText, styles.tagTextGroup]}>{item.group.name}</BodyText>
              </View>
            )}
          </View>

          <View style={styles.productStatsRow}>
            <View style={styles.productStat}>
              <BodyText style={styles.productStatValue}>{item.totalSlabsCount || 0}</BodyText>
              <BodyText style={styles.productStatLabel}> Total Units</BodyText>
            </View>
            <View style={styles.productStat}>
              <BodyText style={styles.productStatValue}>{Number(item.totalQuantity || 0).toFixed(2)}</BodyText>
              <BodyText style={styles.productStatLabel}> Sqft</BodyText>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Icon name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#94A3B8" />
            </View>
          </View>

        </TouchableOpacity>



        {/* Expanded Children List */}
        {isExpanded && renderChildren(item)}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {loading ? (
        <ScreenLoadingIndicator title={`Loading ${type} Inventory...`} />
      ) : (
        <FlatList
          renderItem={renderInventoryItem}
          data={inventory?.data}
          keyExtractor={item => (item.id + item.name).toString()}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={() => <EmptyList />}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {modalFilter && (
        <InventoryProductsModal
          visible={true}
          title={modalTitle}
          filter={modalFilter}
          onClose={(refreshData: boolean) => {
            setModalFilter(null);
            if (refreshData && selectedLocation) {
              dispatch(
                getInventory({ locationId: selectedLocation.id, params: { page: 1, limit: 2000, categorization: type } }),
              );
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardHeaderArea: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
    fontSize: 18,
    marginBottom: 4,
  },
  originWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
  },
  badge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#166534',
    textTransform: 'uppercase',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  tagColor: {
    backgroundColor: '#F0F9FF',
  },
  tagTextColor: {
    color: '#0369A1',
  },
  tagGroup: {
    backgroundColor: '#FDF4FF',
  },
  tagTextGroup: {
    color: '#86198F',
  },
  productStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  productStat: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  productStatValue: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#334155',
  },
  productStatLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  viewDetailsText: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#3B82F6',
  },
  childrenContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  childrenHeaderText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  childCode: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#334155',
  },
  childRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  childStatWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  childStatValue: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
  },
  childStatLabel: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
  },
  childDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
});
