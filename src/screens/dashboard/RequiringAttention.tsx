import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ClipboardCheck, AlertTriangle, Truck, CreditCard } from '@tamagui/lucide-icons';
import { BodyText, Heading5, Heading2 } from '../../components/ui';
import theme from '../../theme';

const ATTENTION_ITEMS = [
  {
    id: 'pending_approvals',
    count: 12,
    label: 'Pending Approvals',
    subLabel: 'Orders awaiting your approval',
    icon: ClipboardCheck,
    color: '#F43F5E',
    bgColor: '#FFF1F2',
  },
  {
    id: 'low_stock',
    count: 8,
    label: 'Low Stock Items',
    subLabel: 'Stock below minimum level',
    icon: AlertTriangle,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  {
    id: 'delayed_deliveries',
    count: 5,
    label: 'Delayed Deliveries',
    subLabel: 'Orders not delivered on time',
    icon: Truck,
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
  {
    id: 'payments_due',
    count: 3,
    label: 'Payments Due',
    subLabel: 'Invoices awaiting payment',
    icon: CreditCard,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
];

export const RequiringAttention: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Requiring Attention</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.viewAllText}>View All</BodyText>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {ATTENTION_ITEMS.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, { backgroundColor: item.bgColor }]}
          >
            <View style={styles.cardHeader}>
              <Heading2 style={[styles.count, { color: item.color }]}>{item.count}</Heading2>
              <item.icon size={20} color={item.color} />
            </View>
            <BodyText style={styles.cardLabel}>{item.label}</BodyText>
            <BodyText style={styles.cardSubLabel}>{item.subLabel}</BodyText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    width: '47%',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  count: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.bold,
  },
  cardLabel: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 13,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.xs,
  },
  cardSubLabel: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    lineHeight: 14,
  },
});
