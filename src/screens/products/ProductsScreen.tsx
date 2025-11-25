import React, { useCallback } from 'react';
import Tabs, { TabItem } from '../../components/ui/Tabs.tsx';
import theme from '../../theme';
import PagerView from 'react-native-pager-view';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { AllProductsScreen } from './AllProductsPage.tsx';
import { ActiveProductsScreen } from './ActiveProductsPage.tsx';
import { InactiveProductsScreen } from './InactiveProductsPage.tsx';
import Button from '../../components/ui/Button.tsx';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';

const tabs: TabItem[] = [
  {
    label: 'All',
    id: 'all_products',
  },
  {
    label: 'Active',
    id: 'active',
  },
  {
    label: 'Inactive',
    id: 'inactive',
  }
]

export const ProductsScreen: React.FC = () => {
  const pagerViewRef = React.useRef<PagerView>(null);
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabPress = useCallback((index: number) => {
    pagerViewRef.current?.setPage(index);
  }, []);

  const handlePageSelected = useCallback((e: any) => {
    setCurrentTab(e.nativeEvent.position);
  }, []);


  const handleAddClick = () => {
    NavigationService.navigate(ScreenId.ADD_PRODUCT)
  }

  return <BaseScreen scrollable={false} keyboardAware={false} style={{ flex: 1 }}>
    <Tabs
      variant={'pill-outlined'}
      style={{padding: theme.spacing.sm, paddingHorizontal: theme.spacing.sm}}
      scrollable={false}
      tabs={tabs}
      selectedIndex={currentTab}
      onTabPress={handleTabPress}/>

    <PagerView
      ref={pagerViewRef}
      style={{ flex: 1 }}
      onPageSelected={handlePageSelected}
      initialPage={currentTab}>
      <AllProductsScreen />
      <ActiveProductsScreen />
      <InactiveProductsScreen />
    </PagerView>
    <Button
      icon={<Icon name={'add'} size={22} color={theme.colors.white}/>}
      onPress={handleAddClick}
      title={'Add'}
      variant={'secondary'}
      style={style.floatingButton}/>
  </BaseScreen>
}

const style = StyleSheet.create({

  floatingButton: {
    ...theme.shadows.lg,
    borderRadius: 22, position:'absolute', bottom: 44, end: theme.spacing.md
  }
})