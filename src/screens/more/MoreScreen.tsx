import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthContext } from '../../context/AuthContext';
import { useAuthState } from '../../store/hooks.ts';
import { BodyText, Heading5, Heading4 } from '../../components/ui';
import { StackId } from '../../navigation/navigationConstants';
import theme from '../../theme';

interface MenuItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Directory',
    items: [
      { id: StackId.PRODUCTS, label: 'Products', emoji: '📦', color: '#0891B2', bgColor: '#E0F2FE' },
      { id: StackId.SUPPLIERS, label: 'Suppliers', emoji: '🏭', color: '#0891B2', bgColor: '#E0F2FE' },
      { id: StackId.CUSTOMERS, label: 'Customers', emoji: '👥', color: '#0891B2', bgColor: '#E0F2FE' },
      { id: StackId.SERVICES, label: 'Services', emoji: '🛠️', color: '#0891B2', bgColor: '#E0F2FE' },
    ],
  },
  {
    title: 'Expenses',
    items: [
      { id: StackId.PURCHASES, label: 'Purchases', emoji: '🛍️', color: '#7C3AED', bgColor: '#EDE9FE' },
      { id: StackId.VENDOR_INVOICES, label: 'Vendor Invoices', emoji: '🧾', color: '#7C3AED', bgColor: '#EDE9FE' },
      { id: StackId.FREIGHT_BILLS, label: 'Freight Bills', emoji: '🚚', color: '#7C3AED', bgColor: '#EDE9FE' },
    ],
  },
  {
    title: 'Accounting',
    items: [
      { id: StackId.GENERAL_LEDGER, label: 'Ledger', emoji: '📒', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.ACCOUNTING_PAYABLE, label: 'Payables', emoji: '📤', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.ACCOUNTING_RECEIVABLE, label: 'Receivables', emoji: '📥', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.CHARTS_OF_ACCOUNTS, label: 'Chart of Acc', emoji: '📊', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.BALANCE_SHEET, label: 'Balance Sheet', emoji: '📑', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.TRANSACTIONS, label: 'Transactions', emoji: '💳', color: '#059669', bgColor: '#D1FAE5' },
      { id: StackId.CREDIT_DEBIG_NOTE, label: 'Credit/Debit', emoji: '📝', color: '#059669', bgColor: '#D1FAE5' },
    ],
  },
  {
    title: 'Deliveries & Returns',
    items: [
      { id: StackId.DELIVERIES, label: 'Deliveries', emoji: '🚚', color: '#D97706', bgColor: '#FEF3C7' },
      // { id: StackId.RETURNS, label: 'Returns', emoji: '↩️', color: '#D97706', bgColor: '#FEF3C7' },
    ],
  },
  {
    title: 'System & Settings',
    items: [
      { id: StackId.USER_ROLES, label: 'User Roles', emoji: '🔑', color: '#475569', bgColor: '#F1F5F9' },
      { id: StackId.USERS, label: 'Users', emoji: '🧑‍💻', color: '#475569', bgColor: '#F1F5F9' },
      { id: StackId.PERMISSIONS, label: 'Permissions', emoji: '🛡️', color: '#475569', bgColor: '#F1F5F9' },
      { id: StackId.LOCATIONS, label: 'Locations', emoji: '📍', color: '#475569', bgColor: '#F1F5F9' },
    ],
  },
];

export const MoreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { authState, logout } = useAuthContext();
  const { loginUserDetail } = useAuthState();
  const userName = loginUserDetail?.username || authState?.username || 'User';

  const handleLogout = () => {
    try {
      logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleNavigate = (stackId: string) => {
    navigation.navigate(stackId);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Heading4 style={styles.headerTitle}>More Modules</Heading4>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <BodyText style={styles.userAvatarText}>
            {userName.charAt(0).toUpperCase()}
          </BodyText>
        </View>
        <View style={styles.userInfo}>
          <Heading5 style={styles.userNameText}>{userName}</Heading5>
          <BodyText style={styles.userRole}>
            {loginUserDetail?.client?.company?.companyName || 'Client User'}
          </BodyText>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {MENU_SECTIONS.map((section, idx) => (
          <View key={section.title} style={idx > 0 && { marginTop: theme.spacing.md }}>
            <BodyText style={styles.sectionLabel}>{section.title}</BodyText>
            
            <View style={styles.grid}>
              {section.items.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuCard}
                  activeOpacity={0.75}
                  onPress={() => handleNavigate(item.id)}>
                  <View style={[styles.menuIconWrap, { backgroundColor: item.bgColor }]}>
                    <BodyText style={styles.menuEmoji}>{item.emoji}</BodyText>
                  </View>
                  <BodyText style={[styles.menuLabel, { color: item.color }]}>
                    {item.label}
                  </BodyText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <BodyText style={styles.appVersion}>Slab Flare v1.0</BodyText>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <BodyText style={styles.logoutText}>🚪 Sign Out</BodyText>
        </TouchableOpacity>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  userAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
  userInfo: { flex: 1 },
  userNameText: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    fontSize: 16,
  },
  userRole: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 2,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#6B7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: theme.spacing.sm,
  },
  menuCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: { fontSize: 18 },
  menuLabel: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  appVersion: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: theme.typography.fontFamily.medium,
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#EF4444',
  },
});

export default MoreScreen;
