import React, { useCallback } from 'react';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import { InventoryBySiplPage } from '../inventory/InventoryBySiplPage.tsx';
import { InventoryByBundlePage } from '../inventory/InventoryByBundlePage.tsx';
import { InventoryByBlockPage } from '../inventory/InventoryByBlockPage.tsx';
import PagerView from 'react-native-pager-view';
import theme from '../../theme';
import { BodyText } from '../../components/ui';
import { View } from 'react-native';
import { SalesOrdersPage } from './SalesOrdersPage.tsx';

const tabs: TabItem[] = [
  {
    id: 'ALL',
    label: 'All',
  },
  {
    id: 'PCK',
    label: 'Packaging List',
  },
  {
    id: 'LO',
    label: 'Loading Order',
  },
  {
    id: 'PP',
    label: 'Payment Pending',
  },
  {
    id: 'OPN',
    label: 'Open',
  },
  {
    id: 'CLSD',
    label: 'Closed',
  },
];
export const SalesOrdersScreen: React.FC = () => {
  const pagerViewRef = React.useRef<PagerView>(null);
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabPress = useCallback((index: number) => {
    pagerViewRef.current?.setPage(index);
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    setSelectedTab(e.nativeEvent.position);
  }, []);

  return (
    <BaseScreen scrollable={false} keyboardAware={false}>
      <View>
        <Tabs
          tabs={tabs}
          variant={'pill-outlined'}
          style={{ paddingVertical: theme.spacing.sm }}
          scrollable={true}
          autoScroll={true}
          selectedIndex={selectedTab}
          onTabPress={handleTabPress}
        />
      </View>
      <PagerView
        ref={pagerViewRef}
        style={{ flex: 1 }}
        onPageSelected={handlePageSelected}
        initialPage={selectedTab}>
        <SalesOrdersPage tab={''} />
        <SalesOrdersPage tab={'PACKAGING_LIST'} />
        <SalesOrdersPage tab={'LOADING_ORDER'} />
        <SalesOrdersPage tab={'PENDING_PAYMENT'} />
        <SalesOrdersPage tab={'OPEN'} />
        <SalesOrdersPage tab={'CLOSED'} />
      </PagerView>
    </BaseScreen>
  );
};
