import React, { useCallback } from 'react';
import {
  StyleSheet
} from 'react-native';
import PagerView from 'react-native-pager-view';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import theme from '../../theme';
import { InventoryBySiplPage } from './InventoryBySiplPage.tsx';


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
    label: 'Block',
  }
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
        style={{ padding: theme.spacing.sm, paddingHorizontal: theme.spacing.sm }}
        scrollable={false}
        tabs={TABS}
        selectedIndex={currentTab}
        onTabPress={handleTabPress} />

      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
        initialPage={currentTab}>
        <InventoryBySiplPage />
        {/* <InventoryByBundlePage />
        <InventoryByBlockPage /> */}
      </PagerView>
    </BaseScreen>
  );
};

const styles = StyleSheet.create({});

export default InventoryScreen;
