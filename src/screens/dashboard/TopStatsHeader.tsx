import React from 'react';
import { View } from 'react-native';
import theme from '../../theme';
import { StatsCard } from './StatsCard.tsx';
import { useAppState } from '../../store/hooks.ts';
import { formatCurrency } from '../../utils/CommonUtility.ts';
import { IconedStatsCard } from './IconedStatsCard.tsx';

export const TopStatsHeader: React.FC = () => {
  const { customersAmounts, openPOs, notes, vendorsAmounts, openSOs, salesAmount, purchaseAmount } =
    useAppState();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <IconedStatsCard
          title={'Open POs'}
          icon={'inventory'}
          color={'#3B82F6'}
          valueStyle={{ color: theme.colors.primaryDark }}
          value={String(openPOs?.count ?? 0)}
          onClick={() => {}}
        />
        <IconedStatsCard
          title={'Open SOs'}
          icon={'shopping-cart'}
          color={theme.colors.status.success}
          value={String(openSOs?.count ?? 0)}
          onClick={() => {}}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <IconedStatsCard
          title={'In Transit'}
          icon={'local-shipping'}
          color={theme.colors.status.warning}
          value={String(openPOs?.count ?? 0)}
          onClick={() => {}}
        />
        <IconedStatsCard
          title={'Low Stock'}
          icon={'inventory'}
          color={theme.colors.status.error}
          value={String(0)}
          onClick={() => {}}
        />
      </View>
      <StatsCard
        title={'Customer Receivables'}
        icon={'people'}
        color={'#3B82F6'}
        trendingUp={true}
        trendingValue={'+12.5%'}
        bottomTitle={'Pending Amount'}
        bottomValue={formatCurrency(
          (customersAmounts?.totalAmount ?? 0) - (customersAmounts?.totalPaidAmount ?? 0),
        )}
        value={`${formatCurrency(customersAmounts?.totalAmount ?? 0)}`}
        onClick={() => {}}
      />
      <StatsCard
        title={'Vendor Receivables'}
        icon={'local-shipping'}
        color={'#3B82F6'}
        trendingUp={false}
        trendingValue={'-5.2%'}
        bottomTitle={'Pending Amount'}
        bottomValue={formatCurrency(
          (vendorsAmounts?.totalAmount ?? 0) - (vendorsAmounts?.totalPaidAmount ?? 0),
        )}
        value={`${formatCurrency(vendorsAmounts?.totalAmount ?? 0)}`}
        onClick={() => {}}
      />
      <StatsCard
        title={'Total Sales'}
        icon={'trending-up'}
        color={theme.colors.status.success}
        trendingUp={true}
        bottomTitle={'vs Last Month'}
        trendingValue={'+18.3%'}
        bottomValue={formatCurrency(
          (salesAmount?.totalAmount ?? 0) - (salesAmount?.totalPaidAmount ?? 0),
        )}
        value={`${formatCurrency(salesAmount?.totalAmount ?? 0)}`}
        onClick={() => {}}
      />

      <StatsCard
        title={'Total Purchase'}
        icon={'shopping-cart'}
        color={theme.colors.status.warning}
        trendingUp={true}
        trendingValue={'+8.7%'}
        bottomTitle={'vs Last Month'}
        bottomValue={formatCurrency(
          (purchaseAmount?.totalAmount ?? 0) - (purchaseAmount?.totalPaidAmount ?? 0),
        )}
        value={`${formatCurrency(purchaseAmount?.totalAmount ?? 0)}`}
        onClick={() => {}}
      />
    </View>
  );
};
