import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { BodyText, Heading5 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';
import moment from 'moment';

interface Transaction {
  id: number;
  paymentType: string;
  amount: number;
  payee?: { name: string };
  transactionCode?: string;
  createdAt: string;
}

export const RecentTransactionsSection: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getRecentTransactions();
        setTransactions(res?.data?.data || []);
      } catch (err) {
        console.error('Transactions fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Recent Transactions</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.viewAll}>View All</BodyText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyWrap}>
          <BodyText style={styles.emptyText}>No recent transactions</BodyText>
        </View>
      ) : (
        <View style={styles.list}>
          {transactions.map((tx, idx) => {
            const isIncoming = tx.paymentType === 'incoming';
            const sign = isIncoming ? '+' : '-';
            const amountColor = isIncoming ? '#10B981' : '#EF4444';
            const bgColor = isIncoming ? '#ECFDF5' : '#FEE2E2';
            const initial = (tx.payee?.name || '?')[0].toUpperCase();
            const payeeName = tx.payee?.name || 'Unknown';
            const subtitle = tx.transactionCode || 'Payment';

            return (
              <View key={tx.id || idx} style={styles.item}>
                <View style={[styles.avatar, { backgroundColor: bgColor }]}>
                  <BodyText style={[styles.avatarText, { color: amountColor }]}>
                    {initial}
                  </BodyText>
                </View>
                <View style={styles.info}>
                  <BodyText style={styles.payeeName} numberOfLines={1}>
                    {payeeName}
                  </BodyText>
                  <BodyText style={styles.subtitle}>{subtitle}</BodyText>
                </View>
                <View style={styles.amountCol}>
                  <BodyText style={[styles.amount, { color: amountColor }]}>
                    {sign}${Number(tx.amount).toFixed(2)}
                  </BodyText>
                  <BodyText style={styles.dateText}>
                    {moment(tx.createdAt).format('MMM DD')}
                  </BodyText>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  viewAll: {
    color: '#0D9488',
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  loadingWrap: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWrap: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  list: { gap: 14 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.bold,
  },
  info: { flex: 1 },
  payeeName: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  amountCol: { alignItems: 'flex-end' },
  amount: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: theme.typography.fontFamily.medium,
  },
});
