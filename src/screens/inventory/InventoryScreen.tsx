import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { Accordion, AccordionGroup, Container, Heading4, Heading6, LabelValue } from '../../components/ui';
import theme from '../../theme';
import { useAppDispatch, useAppState, useInventory } from '../../store/hooks.ts';
import Card from '../../components/ui/Card.tsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Inventory, SiplElement } from '../../types/InventoryTypes.ts';
import { showErrorToast } from '../../utils';
import { EmptyList } from '../../components/ui/EmptyList.tsx';
import { getInventory } from '../../store/slices/inventorySlice.ts';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';
import { UpdateProductsPricingModal } from './UpdateProductsPricingModal.tsx';
import { ScreenLoadingIndicator } from '../../components/ui/ScreenLoadingIndicator.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import PagerView from 'react-native-pager-view';
import { InventoryBySiplPage } from './InventoryBySiplPage.tsx';
import { InventoryByBundlePage } from './InventoryByBundlePage.tsx';
import { InventoryByBlockPage } from './InventoryByBlockPage.tsx';
import { useFocusEffect } from '@react-navigation/native';


const TABS: TabItem[] = [
  {
    id: 'SIPL',
    label: 'SIPL',
  },
  {
    id: 'BUNDLE',
    label: 'Bundle',
  },
  {
    id: 'BLOCK',
    label: 'Block',}
]
const InventoryScreen: React.FC = () => {
  const pagerViewRef = React.useRef<PagerView>(null);
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabPress = useCallback((index: number) => {
    pagerViewRef.current?.setPage(index);
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    setCurrentTab(e.nativeEvent.position);
  }, []);


  return (
    <BaseScreen scrollable={false} keyboardAware={false} style={{ flex: 1 }}>
        <Tabs
          variant={'pill-outlined'}
          style={{padding: theme.spacing.sm, paddingHorizontal: theme.spacing.sm}}
          scrollable={false}
          tabs={TABS}
          selectedIndex={currentTab}
          onTabPress={handleTabPress}/>

      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
        initialPage={currentTab}>
        <InventoryBySiplPage />
        <InventoryByBundlePage />
        <InventoryByBlockPage />
      </PagerView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({});

export default InventoryScreen;
