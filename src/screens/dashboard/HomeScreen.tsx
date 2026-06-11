import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import BaseScreen from '../../components/ui/BaseScreen.tsx';
import { useAuthState } from '../../store/hooks.ts';
import theme from '../../theme';
import { DashboardHeader } from './DashboardHeader';
import { Greeting } from './Greeting';
import { QuickActions } from './QuickActions';
import { RequiringAttention } from './RequiringAttention';
import { TodayActivity } from './TodayActivity';
import { MTDMetrics } from './MTDMetrics';
import { FloatingActionButton, BodyText } from '../../components/ui';
import { Plus, Home, Box, ClipboardList, CheckSquare, LayoutGrid } from '@tamagui/lucide-icons';

const HomeScreen: React.FC = () => {
  const { loginUserDetail } = useAuthState();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  
  const userName = loginUserDetail?.username || 'Chris Evans';

  return (
    <View style={styles.outerContainer}>
      <DashboardHeader 
        onMenuPress={() => navigation.openDrawer()}
        onNotificationPress={() => {}}
        onProfilePress={() => {}}
      />
      <BaseScreen
        scrollable={true}
        keyboardAware={true}
        style={styles.container}
      >
        <Greeting userName={userName} />
        <QuickActions />
        <RequiringAttention />
        <TodayActivity />
        <MTDMetrics />
        {/* Spacer for FAB and Bottom Nav */}
        <View style={{ height: 100 }} />
      </BaseScreen>
      
      <FloatingActionButton 
        icon={<Plus size={24} color={theme.colors.white} />}
        onPress={() => {}}
        bottom={100}
        right={20}
      />
      
      {/* Bottom Tab Bar as seen in the image */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Home size={24} color={theme.colors.primary} />
          <BodyText style={[styles.navLabel, { color: theme.colors.primary }]}>Home</BodyText>
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Box size={24} color="#9CA3AF" />
          <BodyText style={styles.navLabel}>Inventory</BodyText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <ClipboardList size={24} color="#9CA3AF" />
          <BodyText style={styles.navLabel}>Orders</BodyText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View>
            <CheckSquare size={24} color="#9CA3AF" />
            <View style={styles.navBadge}>
              <BodyText style={styles.navBadgeText}>7</BodyText>
            </View>
          </View>
          <BodyText style={styles.navLabel}>Tasks</BodyText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <LayoutGrid size={24} color="#9CA3AF" />
          <BodyText style={styles.navLabel}>More</BodyText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    color: '#9CA3AF',
    fontFamily: theme.typography.fontFamily.medium,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
    position: 'absolute',
    bottom: -8,
  },
  navBadge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#EF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  navBadgeText: {
    color: theme.colors.white,
    fontSize: 8,
    fontFamily: theme.typography.fontFamily.bold,
  }
});

export default HomeScreen;


