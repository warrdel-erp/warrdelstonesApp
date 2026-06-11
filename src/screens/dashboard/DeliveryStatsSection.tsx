import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { BodyText, Heading5 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

interface DeliveryStats {
  pending: number;
  approved: number;
  started: number;
  canceled: number;
  rejected: number;
  completed: number;
}

const STAT_ITEMS = [
  { key: 'pending', label: 'Pending', emoji: '⏳', color: '#D97706', bgColor: '#FEF3C7' },
  { key: 'approved', label: 'Approved', emoji: '✅', color: '#2563EB', bgColor: '#DBEAFE', addKey: 'started' },
  { key: 'canceled', label: 'Canceled', emoji: '🚫', color: '#64748B', bgColor: '#F1F5F9' },
  { key: 'rejected', label: 'Rejected', emoji: '❌', color: '#E11D48', bgColor: '#FFE4E6' },
  { key: 'completed', label: 'Completed', emoji: '🏁', color: '#059669', bgColor: '#D1FAE5' },
];

export const DeliveryStatsSection: React.FC = () => {
  const [stats, setStats] = useState<DeliveryStats>({
    pending: 0,
    approved: 0,
    started: 0,
    canceled: 0,
    rejected: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getDeliveryStats();
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Delivery stats error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Delivery Overview</Heading5>
      </View>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {STAT_ITEMS.map(item => {
            const val =
              (stats[item.key as keyof DeliveryStats] || 0) +
              (item.addKey ? stats[item.addKey as keyof DeliveryStats] || 0 : 0);
            return (
              <View
                key={item.key}
                style={[styles.statCard, { backgroundColor: item.bgColor }]}>
                <View style={styles.statTop}>
                  <Heading5 style={[styles.statValue, { color: item.color }]}>
                    {val}
                  </Heading5>
                  <BodyText style={styles.statEmoji}>{item.emoji}</BodyText>
                </View>
                <BodyText style={[styles.statLabel, { color: item.color }]}>
                  {item.label}
                </BodyText>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  loadingWrap: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
  },
  statCard: {
    width: 110,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: 6,
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
  },
  statEmoji: { fontSize: 18 },
  statLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
});
