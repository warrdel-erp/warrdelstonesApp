import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  Search,
  ChevronDown,
  Star,
  MoreVertical,
  LayoutGrid,
  List,
  Package,
  Layers,
  Box as BoxIcon,
  Receipt,
} from '@tamagui/lucide-icons';
import { BodyText, Heading5, Caption, ImageLoader } from '../../components/ui';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { useAppDispatch, useAppState } from '../../store/hooks.ts';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import theme from '../../theme';
import { Inventory } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { InventoryProductsModal } from './InventoryProductsModal.tsx';
import { GetProductBy } from '../../network/services/InventoryService.ts';
import { services } from '../../network';

export type InventoryTabType = 'BUNDLE' | 'BLOCK' | 'SIPL';

export interface InventoryListPageProps {
  type: InventoryTabType;
}

export const InventoryListPage: React.FC<InventoryListPageProps> = ({ type }) => {
  const dispatch = useAppDispatch();
  const { selectedLocation } = useAppState();

  // Screen Width calculation for Grid View cards
  const gridItemWidth = useMemo(() => (Dimensions.get('window').width - 28) / 2, []);

  // Search, Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [activeFilterModal, setActiveFilterModal] = useState<'category' | 'subcategory' | null>(null);
  const [subcategories, setSubcategories] = useState<{ label: string; value: string }[]>([]);

  // Paginated products state
  const [products, setProducts] = useState<Inventory[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Track expanded product ID for accordion
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  // Level-2 cache: groups (SIPLs/bundles/blocks) per product ID
  const [groupsCache, setGroupsCache] = useState<Record<number, any[]>>({});
  const [groupsLoadingMap, setGroupsLoadingMap] = useState<Record<number, boolean>>({});

  // Track selected child for modal
  const [modalFilter, setModalFilter] = useState<GetProductBy | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');

  // Subcategory is only enabled if category is selected as Slab
  const isSubcategoryDisabled = selectedCategory !== 'Slab';

  const handleSetCategory = (val: string | null) => {
    setSelectedCategory(val);
    if (val !== 'Slab') {
      setSelectedSubcategory(null);
    }
  };

  // Fetch subcategories on mount
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await services.common.getOptions('subcategories');
        if (response.success && response.data?.success) {
          const fetched = response.data.data.map(item => ({
            label: item.label,
            value: item.value as string,
          }));
          setSubcategories(fetched);
        }
      } catch (err: any) {
        console.error('Failed to fetch subcategories:', err);
      }
    };
    fetchSubcategories();
  }, []);

  const fetchProducts = React.useCallback(async (pageNumber: number, shouldRefresh = false) => {
    if (!selectedLocation) return;

    if (pageNumber === 1) {
      if (!shouldRefresh) setLoadingInitial(true);
    } else {
      setLoadingNext(true);
    }

    try {
      let slabFilter: string | undefined = undefined;
      if (selectedCategory === 'Slab') {
        slabFilter = 'true';
      } else if (selectedCategory === 'Generic') {
        slabFilter = 'false';
      }

      const response = await services.inventory.getInventory({
        locationId: selectedLocation.id,
        params: {
          page: pageNumber,
          limit: 15,
          categorization: type,
          ...(slabFilter !== undefined && { isSlabType: slabFilter }),
          ...(selectedSubcategory && { subCategory: selectedSubcategory }),
        },
      });

      if (response.success && response.data) {
        const fetchedProducts = response.data.data || [];
        const totalCount = response.data.paginationData?.total || 0;

        setProducts(prev => shouldRefresh || pageNumber === 1 ? fetchedProducts : [...prev, ...fetchedProducts]);
        setTotal(totalCount);
        setPage(pageNumber);
      } else {
        showErrorToast(response.error?.message[0] || 'Failed to fetch inventory');
      }
    } catch (err: any) {
      showErrorToast(err.message || 'Failed to fetch inventory');
    } finally {
      setLoadingInitial(false);
      setLoadingNext(false);
      setRefreshing(false);
    }
  }, [selectedLocation, type, selectedCategory, selectedSubcategory]);

  const fetchGroups = async (productId: number) => {
    if (groupsCache[productId] !== undefined) return;
    setGroupsLoadingMap(prev => ({ ...prev, [productId]: true }));
    try {
      let response: any;
      if (type === 'BUNDLE') {
        response = await services.inventory.getBundlesByProduct(productId);
      } else if (type === 'BLOCK') {
        response = await services.inventory.getBlocksByProduct(productId);
      } else {
        response = await services.inventory.getSiplsByProduct(productId);
      }

      if (response.success) {
        setGroupsCache(prev => ({ ...prev, [productId]: response.data?.data || [] }));
      } else {
        showErrorToast(response.error?.message[0] || 'Failed to fetch items');
      }
    } catch (e: any) {
      showErrorToast(e.message || 'Failed to fetch items');
    } finally {
      setGroupsLoadingMap(prev => ({ ...prev, [productId]: false }));
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setExpandedProductId(null);
      setGroupsCache({});
      setGroupsLoadingMap({});
      fetchProducts(1, true);
      return () => { };
    }, [fetchProducts]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingNext && products.length < total) {
      fetchProducts(page + 1);
    }
  };

  const categoryOptions = [
    { label: 'Slab', value: 'Slab' },
    { label: 'Generic', value: 'Generic' },
  ];

  const subcategoryOptions = useMemo(() => {
    return subcategories.map(s => ({ label: s.label, value: s.value }));
  }, [subcategories]);

  // Client-side Filter logic
  const filteredData = useMemo(() => {
    if (!products) return [];

    return products.filter(item => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(query);
        const matchesCode = item.alternativeName?.toLowerCase().includes(query);
        const matchesCategory = item.subCategory?.name?.toLowerCase().includes(query);
        const matchesColor = item.baseColor?.name?.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesCategory && !matchesColor) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery]);



  const getAvatarTheme = (name: string) => {
    const firstLetter = (name || '?').trim().charAt(0).toUpperCase();
    const charCode = firstLetter.charCodeAt(0);

    // Harmony palettes matching the web/modern design
    const palettes = [
      { bg: '#ECFEFF', border: '#CFFAFE', text: '#0891B2' }, // Cyan
      { bg: '#F0FDF4', border: '#DCFCE7', text: '#16A34A' }, // Green
      { bg: '#EEF2FF', border: '#E0E7FF', text: '#4F46E5' }, // Indigo
      { bg: '#FDF2F8', border: '#FCE7F3', text: '#DB2777' }, // Pink
      { bg: '#FFF7ED', border: '#FFEDD5', text: '#EA580C' }, // Orange
      { bg: '#FAF5FF', border: '#F3E8FF', text: '#9333EA' }, // Purple
      { bg: '#FFF1F2', border: '#FFE4E6', text: '#E11D48' }, // Rose
      { bg: '#F0F9FF', border: '#E0F2FE', text: '#0284C7' }, // Sky
    ];

    const index = charCode % palettes.length;
    return {
      letter: firstLetter,
      ...palettes[index],
    };
  };

  const renderAvatar = (
    name: string,
    width: number,
    height: number,
    customStyles?: any,
  ) => {
    const themeInfo = getAvatarTheme(name);
    const size = Math.min(width, height);
    return (
      <View
        style={[
          {
            width: width,
            height: height,
            backgroundColor: themeInfo.bg,
            borderColor: themeInfo.border,
            borderWidth: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          },
          customStyles,
        ]}>
        <BodyText
          style={{
            fontSize: Math.floor(size * 0.4),
            fontFamily: theme.typography.fontFamily.bold,
            color: themeInfo.text,
          }}>
          {themeInfo.letter}
        </BodyText>
      </View>
    );
  };

  const ItemSeparator = () => <View style={{ height: 12 }} />;

  const toggleExpand = (productId: number) => {
    setExpandedProductId(prev => {
      const nextExpanded = prev === productId ? null : productId;
      if (nextExpanded !== null) {
        fetchGroups(productId);
      }
      return nextExpanded;
    });
  };

  const openModal = (filter: GetProductBy, title: string) => {
    setModalFilter(filter);
    setModalTitle(title);
  };

  const renderChildren = (item: Inventory) => {
    const isLoading = groupsLoadingMap[item.id];
    const groups = groupsCache[item.id] || [];

    if (isLoading) {
      return (
        <View style={[styles.childrenContainer, { alignItems: 'center', justifyContent: 'center', padding: 20 }]}>
          <ActivityIndicator size="small" color="#0891B2" />
        </View>
      );
    }

    if (type === 'BUNDLE') {
      if (groups.length === 0) {
        return (
          <View style={styles.childrenContainer}>
            <BodyText style={styles.childrenHeaderText}>0 Bundles</BodyText>
            <BodyText style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginVertical: 8 }}>No bundles available</BodyText>
          </View>
        );
      }

      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{groups.length} Bundle{groups.length !== 1 ? 's' : ''}</BodyText>
          {groups.map((bundle: any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ bundle: bundle.bundle }, `Products - Bundle: ${bundle.bundle}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <Layers size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{bundle.bundle || 'Unnamed'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{bundle.unitCount || 0}</BodyText>
                  <BodyText style={styles.childStatLabel}> units</BodyText>
                </View>
                <View style={styles.childDivider} />
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{(bundle.totalArea / 144).toFixed(2)}</BodyText>
                  <BodyText style={styles.childStatLabel}> sqft</BodyText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'BLOCK') {
      if (groups.length === 0) {
        return (
          <View style={styles.childrenContainer}>
            <BodyText style={styles.childrenHeaderText}>0 Blocks</BodyText>
            <BodyText style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginVertical: 8 }}>No blocks available</BodyText>
          </View>
        );
      }

      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{groups.length} Block{groups.length !== 1 ? 's' : ''}</BodyText>
          {groups.map((block: any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ block: block.block }, `Products - Block: ${block.block}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <BoxIcon size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{block.block || 'Unnamed'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{block.unitCount || 0}</BodyText>
                  <BodyText style={styles.childStatLabel}> units</BodyText>
                </View>
                <View style={styles.childDivider} />
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{(block.totalArea / 144).toFixed(2)}</BodyText>
                  <BodyText style={styles.childStatLabel}> sqft</BodyText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (type === 'SIPL') {
      if (groups.length === 0) {
        return (
          <View style={styles.childrenContainer}>
            <BodyText style={styles.childrenHeaderText}>0 SIPL Records</BodyText>
            <BodyText style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', marginVertical: 8 }}>No SIPL records available</BodyText>
          </View>
        );
      }

      return (
        <View style={styles.childrenContainer}>
          <BodyText style={styles.childrenHeaderText}>{groups.length} SIPL Record{groups.length !== 1 ? 's' : ''}</BodyText>
          {groups.map((spl: any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => openModal({ siplId: spl.id }, `Products - SIPL: ${spl.invoiceCode}`)}
              activeOpacity={0.7}
              style={styles.childRow}>
              <View style={styles.childLeft}>
                <Receipt size={16} color="#64748B" />
                <BodyText style={styles.childCode}>{spl.invoiceCode || 'No Invoice'}</BodyText>
              </View>
              <View style={styles.childRight}>
                <View style={styles.childStatWrap}>
                  <BodyText style={styles.childStatValue}>{spl.unitCount || 0}</BodyText>
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

    // Determine stock status dynamically
    const slabCount = item.totalSlabsCount || 0;
    let statusText = 'Out of Stock';
    let statusColor = '#EF4444';
    if (slabCount > 10) {
      statusText = 'In Stock';
      statusColor = '#10B981';
    } else if (slabCount > 0) {
      statusText = 'Low Stock';
      statusColor = '#F97316';
    }

    if (showGrid) {
      // 2-column Grid style card
      return (
        <View style={styles.gridCardContainer}>
          <TouchableOpacity
            onPress={() => toggleExpand(item.id)}
            activeOpacity={0.8}
            style={styles.gridCardTouch}>

            {item.primaryImage?.s3File?.url ? (
              <ImageLoader
                source={item.primaryImage.s3File.url}
                style={styles.gridImage}
                width={gridItemWidth}
                height={100}
              />
            ) : (
              renderAvatar(item.name, gridItemWidth, 100, {
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              })
            )}

            <View style={styles.gridDetails}>
              <View style={styles.gridTitleWrap}>
                <BodyText style={styles.gridProductName} numberOfLines={1}>{item.name}</BodyText>
                <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 2 }} />
              </View>

              <BodyText style={styles.gridSubText} numberOfLines={1}>
                {item.alternativeName || 'N/A'} • {item.subCategory?.name || 'Marble'}
              </BodyText>

              <View style={styles.gridFooter}>
                <BodyText style={[styles.gridStatusText, { color: statusColor }]}>{statusText}</BodyText>
                <View style={styles.gridSlabsContainer}>
                  <BodyText style={styles.gridSlabsCount}>{slabCount}</BodyText>
                  <Caption style={styles.gridSlabsLabel}> Slabs</Caption>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {isExpanded && renderChildren(item)}
        </View>
      );
    }

    // Modern 1-column List style card (mockup redesign)
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.8}
          style={styles.cardHeaderArea}>

          <View style={styles.mainRow}>
            {/* Left Slab Image / Avatar */}
            <View style={styles.thumbnailContainer}>
              {item.primaryImage?.s3File?.url ? (
                <ImageLoader
                  source={item.primaryImage.s3File.url}
                  style={styles.productThumbnail}
                  width={84}
                  height={84}
                />
              ) : (
                renderAvatar(item.name, 84, 84, { borderRadius: 10 })
              )}
            </View>

            {/* Right Information Details */}
            <View style={styles.detailsContainer}>
              {/* Row 1: Name, Star Icon, Stock Badge */}
              <View style={styles.cardTitleRow}>
                <View style={styles.nameStarWrap}>
                  <BodyText style={styles.productName} numberOfLines={1}>{item.name}</BodyText>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 4 }} />
                </View>
                <BodyText style={[styles.stockStatusText, { color: statusColor }]}>
                  {statusText}
                </BodyText>
              </View>

              {/* Row 2: Alternative Code / Category, Bold Slab Unit count */}
              <View style={styles.cardInfoRow}>
                <BodyText style={styles.subText} numberOfLines={1}>
                  {item.alternativeName || 'N/A'}  •  {item.subCategory?.name || 'Marble'}
                </BodyText>

                <View style={styles.slabsBadgeWrap}>
                  <BodyText style={styles.slabsCountNum}>{slabCount}</BodyText>
                  <Caption style={styles.slabsCountLabel}>Slabs</Caption>
                </View>
              </View>

              {/* Row 3: Tags (Pill Tag Badges for Finish & Color) */}
              <View style={styles.tagsRow}>
                {item.group?.name ? (
                  <View style={styles.pillTag}>
                    <BodyText style={styles.pillTagText}>{item.group.name}</BodyText>
                  </View>
                ) : null}
                {item.thickness ? (
                  <View style={styles.pillTag}>
                    <BodyText style={styles.pillTagText}>{item.thickness}cm</BodyText>
                  </View>
                ) : null}
                {item.baseColor?.name ? (
                  <View style={[styles.pillTag, styles.pillTagColor]}>
                    <BodyText style={[styles.pillTagText, styles.pillTagTextColor]}>{item.baseColor.name}</BodyText>
                  </View>
                ) : null}
              </View>

              {/* Row 4: Bin Code Location tag, Options action buttons */}
              <View style={styles.bottomRow}>
                <View style={styles.locationWrap}>
                  <MaterialIcon name="place" size={13} color="#64748B" />
                  <BodyText style={styles.locationText}>
                    {item.binId ? `Bin ${item.binId}` : (item.group?.name || 'A-WH-01')}
                  </BodyText>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => NavigationService.navigate(ScreenId.PRODUCT_DETAIL, { productId: item.id })}
                    style={styles.infoButton}>
                    <MaterialIcon name="info-outline" size={20} color="#0891B2" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.dotsButton}>
                    <MoreVertical size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Children Accordion */}
        {isExpanded && renderChildren(item)}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingNext) return null;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#0891B2" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>

      {/* Search Input Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInner}>
          <Search size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by name"
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={{ padding: 4 }}>
            <MaterialIcon name="mic" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Horizontal Scroll Filter Pills */}
      <View style={styles.filtersScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScrollView}>

          <TouchableOpacity
            style={[styles.filterPill, selectedCategory && styles.filterPillSelected]}
            onPress={() => setActiveFilterModal('category')}>
            <BodyText style={[styles.filterPillText, selectedCategory && styles.filterPillTextSelected]}>
              {selectedCategory || 'Category'}
            </BodyText>
            {selectedCategory ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  handleSetCategory(null);
                }}
                style={styles.clearFilterButton}>
                <MaterialIcon name="close" size={14} color="#0891B2" />
              </TouchableOpacity>
            ) : (
              <ChevronDown size={14} color="#64748B" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedSubcategory && styles.filterPillSelected,
              isSubcategoryDisabled && styles.filterPillDisabled,
            ]}
            disabled={isSubcategoryDisabled}
            onPress={() => setActiveFilterModal('subcategory')}>
            <BodyText style={[
              styles.filterPillText,
              selectedSubcategory && styles.filterPillTextSelected,
              isSubcategoryDisabled && styles.filterPillTextDisabled,
            ]}>
              {selectedSubcategory || 'Subcategory'}
            </BodyText>
            {selectedSubcategory ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedSubcategory(null);
                }}
                style={styles.clearFilterButton}>
                <MaterialIcon name="close" size={14} color="#0891B2" />
              </TouchableOpacity>
            ) : (
              <ChevronDown size={14} color={isSubcategoryDisabled ? '#94A3B8' : '#64748B'} />
            )}
          </TouchableOpacity>

        </ScrollView>
      </View>

      {/* Stats Summary Box, Sorting & Grid/List switches */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.packageIconWrap}>
            <Package size={20} color="#0891B2" />
          </View>
          <View style={styles.statsTextWrap}>
            <BodyText style={styles.statsCount}>{total.toLocaleString()}</BodyText>
            <Caption style={styles.statsLabel}>Total Items</Caption>
          </View>
        </View>

        <View style={styles.statsActions}>
          <View style={styles.layoutToggleContainer}>
            <TouchableOpacity
              style={[styles.layoutButton, !showGrid && styles.layoutButtonActive]}
              onPress={() => setShowGrid(false)}>
              <List size={16} color={!showGrid ? '#0891B2' : '#64748B'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.layoutButton, showGrid && styles.layoutButtonActive]}
              onPress={() => setShowGrid(true)}>
              <LayoutGrid size={16} color={showGrid ? '#0891B2' : '#64748B'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main List */}
      {loadingInitial ? (
        <ScreenLoadingIndicator title={`Loading ${type} Inventory...`} />
      ) : (
        <FlatList
          key={showGrid ? 'grid' : 'list'}
          numColumns={showGrid ? 2 : 1}
          renderItem={renderInventoryItem}
          data={filteredData}
          keyExtractor={item => (item.id + item.name + showGrid).toString()}
          ItemSeparatorComponent={ItemSeparator}
          contentContainerStyle={showGrid ? styles.gridContentContainer : styles.listContentContainer}
          ListEmptyComponent={() => <EmptyList />}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {/* Detail products modal */}
      {modalFilter && (
        <InventoryProductsModal
          visible={true}
          title={modalTitle}
          filter={modalFilter}
          onClose={(refreshData: boolean) => {
            setModalFilter(null);
            if (refreshData) {
              fetchProducts(1, true);
            }
          }}
        />
      )}

      {/* Selection Drawer Modals */}
      <Modal
        visible={activeFilterModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveFilterModal(null)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveFilterModal(null)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <BodyText style={styles.modalTitle}>
                {activeFilterModal === 'category' ? 'Select Category' :
                  activeFilterModal === 'subcategory' ? 'Select Subcategory' : 'Select Option'}
              </BodyText>
              <TouchableOpacity onPress={() => setActiveFilterModal(null)} style={{ padding: 4 }}>
                <MaterialIcon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={
                activeFilterModal === 'category' ? categoryOptions :
                  activeFilterModal === 'subcategory' ? subcategoryOptions : []
              }
              keyExtractor={(item: any) => String(item.value || '')}
              renderItem={({ item }: { item: any }) => {
                const val = item.value || '';
                const isSelected =
                  activeFilterModal === 'category' ? selectedCategory === val :
                    activeFilterModal === 'subcategory' ? selectedSubcategory === val : false;

                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                    onPress={() => {
                      if (activeFilterModal === 'category') {
                        handleSetCategory(selectedCategory === val ? null : val);
                      } else if (activeFilterModal === 'subcategory') {
                        setSelectedSubcategory(selectedSubcategory === val ? null : val);
                      }
                      setActiveFilterModal(null);
                    }}>
                    <BodyText style={[styles.modalItemText, isSelected && styles.modalItemTextSelected]}>
                      {item.label}
                    </BodyText>
                    {isSelected && <MaterialIcon name="check" size={20} color="#0891B2" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  // Search Bar
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontFamily: theme.typography.fontFamily.medium,
    padding: 0,
    margin: 0,
  },

  // Filters Scroll view
  filtersScrollContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filtersScrollView: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  filterPillActive: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
  },
  filterPillSelected: {
    borderColor: '#0891B2',
    backgroundColor: '#ECFEFF',
  },
  filterPillDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  filterPillText: {
    fontSize: 13,
    color: '#475569',
    fontFamily: theme.typography.fontFamily.medium,
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: theme.typography.fontFamily.bold,
  },
  filterPillTextSelected: {
    color: '#0891B2',
    fontFamily: theme.typography.fontFamily.bold,
  },
  filterPillTextDisabled: {
    color: '#94A3B8',
  },
  blueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginLeft: 2,
  },
  clearFilterButton: {
    padding: 2,
    marginLeft: 4,
    borderRadius: 10,
    backgroundColor: '#CFFAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats Card & Header row
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFEFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CFFAFE',
  },
  packageIconWrap: {
    backgroundColor: '#CFFAFE',
    padding: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  statsTextWrap: {
    justifyContent: 'center',
  },
  statsCount: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0891B2',
    lineHeight: 18,
  },
  statsLabel: {
    fontSize: 10,
    color: '#0891B2',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 11,
  },
  statsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#475569',
    fontFamily: theme.typography.fontFamily.medium,
  },
  layoutToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 2,
  },
  layoutButton: {
    padding: 6,
    borderRadius: 6,
  },
  layoutButtonActive: {
    backgroundColor: '#FFFFFF',
  },

  // List content container
  listContentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  gridContentContainer: {
    padding: 8,
    paddingBottom: 120,
  },

  // List style card (mockup redesign)
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardHeaderArea: {
    padding: 12,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  thumbnailContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  productThumbnail: {
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameStarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  productName: {
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
    fontSize: 16,
  },
  starButton: {
    padding: 2,
  },
  stockStatusText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
    flex: 1,
  },
  slabsBadgeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slabsCountNum: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
    lineHeight: 18,
  },
  slabsCountLabel: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  pillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillTagColor: {
    backgroundColor: '#F0F9FF',
  },
  pillTagText: {
    fontSize: 11,
    color: '#475569',
    fontFamily: theme.typography.fontFamily.bold,
  },
  pillTagTextColor: {
    color: '#0369A1',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.bold,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoButton: {
    padding: 4,
  },
  dotsButton: {
    padding: 4,
  },

  // Grid Layout Card styles
  gridCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
    overflow: 'hidden',
  },
  gridCardTouch: {
    overflow: 'hidden',
  },
  gridImage: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gridDetails: {
    padding: 10,
  },
  gridTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  gridProductName: {
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
    fontSize: 14,
    flex: 1,
  },
  gridSubText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: 6,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  gridStatusText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  gridSlabsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  gridSlabsCount: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
  },
  gridSlabsLabel: {
    fontSize: 9,
    color: '#64748B',
  },

  // Accordion details style
  childrenContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  childrenHeaderText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  childLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  childCode: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#334155',
  },
  childRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  childStatWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  childStatValue: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
  },
  childStatLabel: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: theme.typography.fontFamily.medium,
  },
  childDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 2,
  },

  // Selection Modal overlay styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
    color: '#0F172A',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  modalItemSelected: {
    backgroundColor: '#ECFEFF',
  },
  modalItemText: {
    fontSize: 15,
    color: '#334155',
    fontFamily: theme.typography.fontFamily.medium,
  },
  modalItemTextSelected: {
    color: '#0891B2',
    fontFamily: theme.typography.fontFamily.bold,
  },
});