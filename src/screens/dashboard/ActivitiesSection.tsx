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

interface ActivityItem {
  id: number;
  activityType: string;
  referenceId: number;
  referenceType: string;
  title: string;
  description: string;
  createdAt: string;
  account?: {
    email: string;
    user?: { username: string };
  };
}

const ACTIVITY_CONFIG: Record<
  string,
  { emoji: string; label: string; color: string; bgColor: string }
> = {
  sales_order_creation: {
    emoji: '🛒',
    label: 'Sales Order',
    color: '#4338CA',
    bgColor: '#E0E7FF',
  },
  sales_invoice_creation: {
    emoji: '🧾',
    label: 'Sales Invoice',
    color: '#0D9488',
    bgColor: '#E2F8F0',
  },
  delivery_initiation: {
    emoji: '🚚',
    label: 'Delivery Initiated',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  delivery_approval: {
    emoji: '✅',
    label: 'Delivery Approved',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  delivery_rejection: {
    emoji: '❌',
    label: 'Delivery Rejected',
    color: '#EF4444',
    bgColor: '#FEE2E2',
  },
  return_initiation: {
    emoji: '↩️',
    label: 'Return Initiated',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  return_confirmation: {
    emoji: '✔️',
    label: 'Return Confirmed',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
  return_rejection: {
    emoji: '🚫',
    label: 'Return Cancelled',
    color: '#64748B',
    bgColor: '#CBD5E1',
  },
};

const DEFAULT_CONFIG = {
  emoji: '📌',
  label: 'Activity',
  color: '#0D9488',
  bgColor: '#CCFBF1',
};

const timeAgo = (dateStr: string): string => {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.round(ms / 60000);
  const hrs = Math.round(ms / 3600000);
  const days = Math.round(ms / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const ActivitiesSection: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getDashboardActivities(1, 5);
        if (res?.data?.data?.rows) {
          setActivities(res.data.data.rows);
        }
      } catch (err) {
        console.error('Activities fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Activities</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.viewAll}>View All</BodyText>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : activities.length === 0 ? (
        <View style={styles.emptyWrap}>
          <BodyText style={styles.emptyText}>No recent activity tracked.</BodyText>
        </View>
      ) : (
        <View style={styles.list}>
          {activities.map(activity => {
            const cfg = ACTIVITY_CONFIG[activity.activityType] || DEFAULT_CONFIG;
            const actor =
              activity.account?.user?.username ||
              activity.account?.email ||
              'System';
            return (
              <View key={activity.id} style={styles.item}>
                <View style={[styles.iconWrap, { backgroundColor: cfg.bgColor }]}>
                  <BodyText style={styles.iconEmoji}>{cfg.emoji}</BodyText>
                </View>
                <View style={styles.itemBody}>
                  <View style={styles.itemTop}>
                    <View
                      style={[
                        styles.typePill,
                        { backgroundColor: cfg.bgColor + 'AA' },
                      ]}>
                      <BodyText style={[styles.typeText, { color: cfg.color }]}>
                        {cfg.label}
                      </BodyText>
                    </View>
                    <BodyText style={styles.timeText}>
                      {timeAgo(activity.createdAt)}
                    </BodyText>
                  </View>
                  <BodyText style={styles.descText} numberOfLines={2}>
                    <BodyText style={styles.actorText}>{actor} </BodyText>
                    {activity.description}
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
    height: 120,
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
    fontStyle: 'italic',
    fontSize: theme.typography.fontSize.sm,
  },
  list: { gap: 2 },
  item: {
    flexDirection: 'row',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconEmoji: { fontSize: 16 },
  itemBody: { flex: 1 },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  typePill: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: theme.typography.fontFamily.medium,
  },
  descText: {
    fontSize: 12,
    color: '#1E293B',
    lineHeight: 17,
    fontFamily: theme.typography.fontFamily.regular,
  },
  actorText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
});
