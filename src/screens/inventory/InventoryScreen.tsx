import React, { useCallback } from 'react';
import { StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import { Heading4, Caption } from '../../components/ui';
import { MapPin, Menu, Bell, Scan } from '@tamagui/lucide-icons';
import { useAppState } from '../../store/hooks.ts';
import { AppContextSelector } from '../../components/AppContextSelector';
import theme from '../../theme';
import { InventoryListPage } from './InventoryListPage.tsx';

const TABS: TabItem[] = [
  {
    id: 'BUNDLE',
    label: 'Bundle',
  },
  {
    id: 'BLOCK',
    label: 'Block',
  },
  {
    id: 'SIPL',
    label: 'SIPL',
  }
]

const InventoryScreen: React.FC<any> = ({ navigation }) => {
  const pagerViewRef = React.useRef<PagerView>(null);
  const [currentTab, setCurrentTab] = React.useState(0);
  const insets = useSafeAreaInsets();
  const { selectedLocation } = useAppState();
  const [showLocationModal, setShowLocationModal] = React.useState(false);

  const handleTabPress = useCallback((index: number) => {
    pagerViewRef.current?.setPage(index);
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    setCurrentTab(e.nativeEvent.position);
  }, []);

  return (
    <BaseScreen scrollable={false} keyboardAware={false} style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={() => (navigation as any)?.toggleDrawer?.()} 
            style={styles.headerBtn}>
            <Menu size={22} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Heading4 style={styles.headerTitle}>Inventory</Heading4>
        </View>

        <View style={styles.headerRight}>
          {/* Location button */}
          <TouchableOpacity
            style={styles.locationSelectorBtn}
            onPress={() => setShowLocationModal(true)}>
            <MapPin size={13} color="#0891B2" />
            <Caption style={styles.locationText} numberOfLines={1}>
              {selectedLocation?.locationName || 'Location'}
            </Caption>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerBtn}>
            <Scan size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerBtn}>
            <View style={styles.bellIconContainer}>
              <Bell size={20} color={theme.colors.text.primary} />
              <View style={styles.badgeContainer}>
                <Caption style={styles.badgeText}>3</Caption>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: theme.spacing.sm }}>
        <Tabs
          variant={'pill-outlined'}
          scrollable={false}
          tabs={TABS}
          selectedIndex={currentTab}
          onTabPress={handleTabPress}
        />
      </View>

      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
        initialPage={currentTab}>

        <View key="0" style={{ flex: 1 }}>
          <InventoryListPage type="BUNDLE" />
        </View>
        <View key="1" style={{ flex: 1 }}>
          <InventoryListPage type="BLOCK" />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <InventoryListPage type="SIPL" />
        </View>

      </PagerView>

      <AppContextSelector visible={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  headerBtn: {
    padding: 6,
  },
  locationSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFEFF',
    borderColor: '#CFFAFE',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    maxWidth: 110,
  },
  locationText: {
    color: '#0891B2',
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 11,
  },
  bellIconContainer: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
