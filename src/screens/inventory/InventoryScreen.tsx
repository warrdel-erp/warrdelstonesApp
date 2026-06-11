import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
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
    </BaseScreen>
  );
};

export default InventoryScreen;
