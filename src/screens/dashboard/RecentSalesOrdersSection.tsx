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

interface SalesOrder {
  id: number;
  clientSoNumber: string;
  customer?: { name: string };
  totalAmount: number;
  createdAt: string;
  loadingOrders?: { id: number; code: string }[];
}

export const RecentSalesOrdersSection: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getRecentSalesOrders();
        setOrders(res?.data?.data || []);
      } catch (err) {
        console.error('Sales orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Recent Sales Orders</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.viewAll}>View All</BodyText>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <BodyText style={[styles.colHead, { flex: 1.4 }]}>S.O. #</BodyText>
        <BodyText style={[styles.colHead, { flex: 2 }]}>Customer</BodyText>
        <BodyText style={[styles.colHead, { flex: 1.2 }]}>Date</BodyText>
        <BodyText style={[styles.colHead, { flex: 1.2, textAlign: 'right' }]}>Amount</BodyText>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyWrap}>
          <BodyText style={styles.emptyText}>No recent sales orders found</BodyText>
        </View>
      ) : (
        <View style={styles.tableBody}>
          {orders.map((order, idx) => (
            <View
              key={order.id}
              style={[
                styles.tableRow,
                idx % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <View style={{ flex: 1.4 }}>
                <BodyText style={styles.soNum} numberOfLines={1}>
                  SO #{order.clientSoNumber}
                </BodyText>
              </View>
              <View style={{ flex: 2 }}>
                <BodyText style={styles.customerName} numberOfLines={1}>
                  {order.customer?.name || '--'}
                </BodyText>
              </View>
              <View style={{ flex: 1.2 }}>
                <BodyText style={styles.date}>
                  {moment(order.createdAt).format('DD MMM')}
                </BodyText>
                <BodyText style={styles.time}>
                  {moment(order.createdAt).utc().format('HH:mm')}
                </BodyText>
              </View>
              <View style={{ flex: 1.2, alignItems: 'flex-end' }}>
                <BodyText style={styles.amount}>
                  ${Number(order.totalAmount).toFixed(2)}
                </BodyText>
              </View>
            </View>
          ))}
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
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 4,
  },
  colHead: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  tableBody: { gap: 2 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  rowEven: { backgroundColor: 'transparent' },
  rowOdd: { backgroundColor: '#F8FAFC' },
  soNum: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.primary,
  },
  customerName: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  date: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  time: {
    fontSize: 10,
    color: '#F59E0B',
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  amount: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
});
