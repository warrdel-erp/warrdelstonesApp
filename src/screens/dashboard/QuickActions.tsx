import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { PackagePlus, ShoppingCart, ScanLine, FileText, Wallet } from '@tamagui/lucide-icons';
import { BodyText, Heading5 } from '../../components/ui';
import theme from '../../theme';

const ACTIONS = [
  { id: 'add_inventory', label: 'Add\nInventory', icon: PackagePlus, color: '#3B82F6' },
  { id: 'create_order', label: 'Create\nOrder', icon: ShoppingCart, color: '#3B82F6' },
  { id: 'scan_slab', label: 'Scan\nSlab', icon: ScanLine, color: '#3B82F6' },
  { id: 'create_invoice', label: 'Create\nInvoice', icon: FileText, color: '#3B82F6' },
  { id: 'receive_payment', label: 'Receive\nPayment', icon: Wallet, color: '#3B82F6' },
];

export const QuickActions: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Quick Actions</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.customizeText}>Customize</BodyText>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {ACTIONS.map((action) => (
          <TouchableOpacity key={action.id} style={styles.actionCard}>
            <View style={styles.iconContainer}>
              <action.icon size={24} color={action.color} />
            </View>
            <BodyText style={styles.actionLabel}>{action.label}</BodyText>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  customizeText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  actionCard: {
    width: 85,
    height: 100,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily.medium,
    lineHeight: 14,
    color: theme.colors.text.primary,
  },
});
