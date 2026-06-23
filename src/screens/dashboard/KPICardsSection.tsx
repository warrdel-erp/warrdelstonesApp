import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { FileText, ShoppingCart, Truck, AlertTriangle } from '@tamagui/lucide-icons';
import { BodyText, Heading4 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

interface KPIItem {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: any;
}

export const KPICardsSection: React.FC = () => {
  const [openPOs, setOpenPOs] = useState(0);
  const [openSOs, setOpenSOs] = useState(0);
  const [poInTransit, setPoInTransit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [poRes, soRes, transitRes] = await Promise.all([
          dashboardService.getTotalOpenPo(),
          dashboardService.getTotalOpenSo(),
          dashboardService.getPoInTransit(),
        ]);
        setOpenPOs(poRes.data?.data?.count || 0);
        setOpenSOs(soRes.data?.data?.count || 0);
        setPoInTransit(
          transitRes.data?.data?.count || poRes.data?.data?.count || 0,
        );
      } catch (err) {
        console.error('KPI fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, []);

  const kpis: KPIItem[] = [
    {
      title: 'Open POs',
      value: openPOs,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.08)',
      icon: FileText,
    },
    {
      title: 'Open SOs',
      value: openSOs,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
      icon: ShoppingCart,
    },
    {
      title: 'In Transit',
      value: poInTransit,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
      icon: Truck,
    },
    {
      title: 'Low Stock',
      value: 0,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.08)',
      icon: AlertTriangle,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading4 style={styles.title}>Key Metrics</Heading4>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <View key={idx} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: kpi.bgColor }]}>
                  <IconComponent size={14} color={kpi.color} />
                </View>
              </View>
              <View style={styles.cardBody}>
                {loading ? (
                  <ActivityIndicator size="small" color={kpi.color} style={styles.loader} />
                ) : (
                  <Heading4 style={styles.kpiValue}>{kpi.value}</Heading4>
                )}
                <BodyText style={styles.kpiLabel}>{kpi.title}</BodyText>
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: 10,
    paddingBottom: 4, // for shadows
  },
  card: {
    width: 95,
    height: 85,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    marginTop: 2,
  },
  loader: {
    alignSelf: 'flex-start',
    height: 22,
  },
  kpiValue: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    lineHeight: 22,
  },
  kpiLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
});
