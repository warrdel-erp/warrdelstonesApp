import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { BodyText, Heading4 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

interface KPIItem {
  title: string;
  value: number;
  color: string;
  bgColor: string;
  icon: string;
}

const ICONS: Record<string, string> = {
  'Open POs': '📋',
  'Open SOs': '🛒',
  'In Transit': '🚚',
  'Low Stock': '⚠️',
};

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
    { title: 'Open POs', value: openPOs, color: '#2563EB', bgColor: '#DBEAFE', icon: '📋' },
    { title: 'Open SOs', value: openSOs, color: '#059669', bgColor: '#D1FAE5', icon: '🛒' },
    { title: 'In Transit', value: poInTransit, color: '#7C3AED', bgColor: '#EDE9FE', icon: '🚚' },
    { title: 'Low Stock', value: 0, color: '#E11D48', bgColor: '#FFE4E6', icon: '⚠️' },
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
        {kpis.map((kpi, idx) => (
          <View key={idx} style={[styles.card, { borderLeftColor: kpi.color }]}>
            <View style={[styles.iconWrap, { backgroundColor: kpi.bgColor }]}>
              <BodyText style={styles.iconText}>{kpi.icon}</BodyText>
            </View>
            <View style={styles.cardBody}>
              <BodyText style={[styles.kpiLabel, { color: theme.colors.text.secondary }]}>
                {kpi.title}
              </BodyText>
              {loading ? (
                <ActivityIndicator size="small" color={kpi.color} />
              ) : (
                <Heading4 style={[styles.kpiValue, { color: kpi.color }]}>
                  {kpi.value}
                </Heading4>
              )}
            </View>
          </View>
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
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: 12,
  },
  card: {
    width: 130,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  cardBody: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: 22,
    fontFamily: theme.typography.fontFamily.bold,
    lineHeight: 28,
  },
});
