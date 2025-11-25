import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { Caption, Container, Dropdown, Heading5, Heading6 } from '../../components/ui';
import { AppContextSelector } from '../../components/AppContextSelector.tsx';
import { useScreenContext } from '../../context/ScreenContext.tsx';
import theme from '../../theme';
import { TopStatsHeader } from './TopStatsHeader.tsx';
import { chartConfig, data, DATE_FILTERS } from '../ConstantData.ts';
import { useAppDispatch, useAuthState } from '../../store/hooks.ts';
import { setDashboardFilter } from '../../store/slices/appSlice.ts';
import { LineChart } from 'react-native-chart-kit';
import Card from '../../components/ui/Card.tsx';
import { RevenueExpenseTrend } from './RevenueExpenseTrend.tsx';
import { OrderDistributionChart } from './OrderDistributionChart.tsx';
import { InventoryByCategoryChart } from './InventoryByCategoryChart.tsx';

const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loginUserDetail } = useAuthState();
  const [showModal, setShowModal] = React.useState(false);
  const { registerActions } = useScreenContext();
  const [selectedDateRange, setSelectedDateRange] = React.useState<number>(1);
  const userName = loginUserDetail?.username;
  const subTitle = loginUserDetail?.client?.company?.companyName;

  useEffect(() => {
    registerActions({
      homeScreenActions: {
        onSettingsPress: () => setShowModal(true),
      },
    });
  }, [registerActions]);

  return (
    <BaseScreen
      scrollable={true}
      keyboardAware={true}
      style={{ flex: 1, paddingBottom: theme.spacing.lg }}>
      <Container style={{ gap: theme.spacing.md }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'flex-start',
              gap: theme.spacing.xs,
            }}>
            <Heading5>Hi, {userName ?? ''}</Heading5>
            <Caption>{subTitle}</Caption>
          </View>
          <Dropdown
            style={{ backgroundColor: 'transparent', width: 150, minHeight: 24 }}
            textStyle={{ fontSize: 14 }}
            useBottomSheet={true}
            options={DATE_FILTERS}
            value={selectedDateRange}
            onSelectionChange={id => {
              dispatch(setDashboardFilter(DATE_FILTERS.find(item => item.id === id)!));
              setSelectedDateRange(id as number);
            }}
          />
        </View>

        <TopStatsHeader />
        <RevenueExpenseTrend />
        <OrderDistributionChart />
        <InventoryByCategoryChart />
      </Container>
      <AppContextSelector visible={showModal} onClose={() => setShowModal(false)} />
    </BaseScreen>
  );
};

const styles = StyleSheet.create({});

export default HomeScreen;
