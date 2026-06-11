import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, Search, Plus, MapPin } from '@tamagui/lucide-icons';
import { BodyText, Heading2, Heading5 } from '../../components/ui';
import { useAppState, useAuthState } from '../../store/hooks.ts';
import { AppContextSelector } from '../../components/AppContextSelector';
import { Caption } from '../../components/ui';
import theme from '../../theme';

// Section imports
import { KPICardsSection } from './KPICardsSection';
import { StatisticsSection } from './StatisticsSection';
import { EstimatedRevenueSection } from './EstimatedRevenueSection';
import { RequiringAttention } from './RequiringAttention';
import { InventoryDistributionSection } from './InventoryDistributionSection';
import { ActivitiesSection } from './ActivitiesSection';
import { RecentTransactionsSection } from './RecentTransactionsSection';
import { RecentSalesOrdersSection } from './RecentSalesOrdersSection';
import { DeliveryStatsSection } from './DeliveryStatsSection';
import { QuickActions } from './QuickActions';
import { TodayActivity } from './TodayActivity';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const HomeScreen: React.FC = () => {
  const { loginUserDetail } = useAuthState();
  const { selectedLocation } = useAppState();
  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const insets = useSafeAreaInsets();
  const userName = loginUserDetail?.username || 'User';

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <BodyText style={styles.logoText}>SF</BodyText>
          </View>
          <View>
            <BodyText style={styles.greetingSmall}>{getGreeting()},</BodyText>
            <Heading5 style={styles.userName}>{userName} 👋</Heading5>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={[styles.iconBtn, { flexDirection: 'row', width: 'auto', paddingHorizontal: 8, gap: 4 }]}
            onPress={() => setShowLocationModal(true)}>
            <MapPin size={16} color={theme.colors.text.primary} />
            <Caption style={{ color: theme.colors.text.primary, maxWidth: 80 }} numberOfLines={1}>
              {selectedLocation?.locationName || 'Location'}
            </Caption>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Search size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <View>
              <Bell size={20} color={theme.colors.text.primary} />
              {/* Notification badge */}
              <View style={styles.notifBadge}>
                <BodyText style={styles.notifBadgeText}>3</BodyText>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleRow}>
        <BodyText style={styles.subtitle}>
          Here's what's happening today.
        </BodyText>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* 1. Key Metrics */}
        <KPICardsSection />

        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Statistics Chart */}
        <StatisticsSection />

        {/* 4. Estimated Revenue */}
        <EstimatedRevenueSection />

        {/* 5. Requiring Attention */}
        <View style={styles.sectionWrap}>
          <RequiringAttention />
        </View>

        {/* 6. Inventory Distribution */}
        <InventoryDistributionSection />

        {/* 7. Today's Activity (timeline) */}
        <View style={styles.sectionWrap}>
          <TodayActivity />
        </View>

        {/* 8. Activities Feed */}
        <ActivitiesSection />

        {/* 9. Recent Transactions */}
        <RecentTransactionsSection />

        {/* 10. Recent Sales Orders */}
        <RecentSalesOrdersSection />

        {/* 11. Delivery Stats */}
        <DeliveryStatsSection />

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 96 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={[styles.fab, { bottom: 16 }]}>
        <Plus size={22} color={theme.colors.white} />
      </TouchableOpacity>
      <AppContextSelector visible={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: theme.colors.white,
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: 14,
  },
  greetingSmall: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    fontSize: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.white,
  },
  notifBadgeText: {
    fontSize: 8,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.white,
  },
  avatarBtn: {
    position: 'relative',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: theme.colors.white,
  },

  // Subtitle
  subtitleRow: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    paddingTop: theme.spacing.md,
  },
  sectionWrap: {
    marginHorizontal: 0,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default HomeScreen;
