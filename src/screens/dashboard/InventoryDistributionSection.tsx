import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { BodyText, Heading5 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PIE_SIZE = 110;
const PIE_CX = PIE_SIZE / 2;
const PIE_CY = PIE_SIZE / 2;
const PIE_R = 38;
const PIE_INNER_R = 26;

const SLAB_COLORS = ['#4338CA', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];
const GENERIC_COLORS = ['#0D9488', '#14B8A6', '#2DD4BF', '#5EEAD4', '#99F6E4'];

interface CatItem {
  name: string;
  value: number;
  count: number;
}

const buildPieSlices = (
  items: CatItem[],
  colors: string[],
): { path: string; color: string }[] => {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (!total) return [];
  let angle = -Math.PI / 2;
  return items.map((item, i) => {
    const slice = (item.count / total) * 2 * Math.PI;
    const x1 = PIE_CX + PIE_R * Math.cos(angle);
    const y1 = PIE_CY + PIE_R * Math.sin(angle);
    angle += slice;
    const x2 = PIE_CX + PIE_R * Math.cos(angle);
    const y2 = PIE_CY + PIE_R * Math.sin(angle);
    const large = slice > Math.PI ? 1 : 0;
    const xi1 = PIE_CX + PIE_INNER_R * Math.cos(angle);
    const yi1 = PIE_CY + PIE_INNER_R * Math.sin(angle);
    const xi2 = PIE_CX + PIE_INNER_R * Math.cos(angle - slice);
    const yi2 = PIE_CY + PIE_INNER_R * Math.sin(angle - slice);
    const path = `M ${x1} ${y1} A ${PIE_R} ${PIE_R} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${PIE_INNER_R} ${PIE_INNER_R} 0 ${large} 0 ${xi2} ${yi2} Z`;
    return { path, color: colors[i % colors.length] };
  });
};

const MiniPieChart: React.FC<{
  items: CatItem[];
  colors: string[];
  total: number;
}> = ({ items, colors, total }) => {
  const slices = buildPieSlices(items, colors);
  return (
    <Svg width={PIE_SIZE} height={PIE_SIZE}>
      {slices.length > 0 ? (
        slices.map((s, i) => (
          <Path key={i} d={s.path} fill={s.color} />
        ))
      ) : (
        <Circle
          cx={PIE_CX}
          cy={PIE_CY}
          r={PIE_R}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={14}
        />
      )}
      {/* Donut hole */}
      <Circle cx={PIE_CX} cy={PIE_CY} r={PIE_INNER_R - 2} fill={theme.colors.white} />
    </Svg>
  );
};

const LegendItems: React.FC<{ items: CatItem[]; colors: string[] }> = ({
  items,
  colors,
}) => (
  <View style={legendStyles.wrap}>
    {items.slice(0, 4).map((item, i) => (
      <View key={i} style={legendStyles.row}>
        <View style={[legendStyles.dot, { backgroundColor: colors[i % colors.length] }]} />
        <BodyText style={legendStyles.name} numberOfLines={1}>
          {item.name}
        </BodyText>
        <BodyText style={legendStyles.pct}>{item.value}% ({item.count})</BodyText>
      </View>
    ))}
    {items.length > 4 && (
      <BodyText style={legendStyles.more}>+{items.length - 4} more</BodyText>
    )}
  </View>
);

const legendStyles = StyleSheet.create({
  wrap: { flex: 1, marginLeft: 12, justifyContent: 'center', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  name: {
    flex: 1,
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  pct: {
    fontSize: 10,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  more: {
    fontSize: 11,
    color: theme.colors.primary,
    fontFamily: theme.typography.fontFamily.medium,
    fontStyle: 'italic',
    marginLeft: 14,
  },
});

export const InventoryDistributionSection: React.FC = () => {
  const [slabs, setSlabs] = useState<CatItem[]>([]);
  const [generics, setGenerics] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getCategoryWiseQuantity();
        if (res?.data?.data) {
          setSlabs(res.data.data.slabs || []);
          setGenerics(res.data.data.generics || []);
        }
      } catch (err) {
        console.error('Inventory distribution error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  const totalSlabs = slabs.reduce((s, i) => s + i.count, 0);
  const totalGenerics = generics.reduce((s, i) => s + i.count, 0);

  return (
    <View style={styles.card}>
      <Heading5 style={styles.title}>Inventory Distribution</Heading5>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.body}>
          {/* Slabs */}
          <View style={styles.section}>
            <BodyText style={styles.sectionLabel}>Slab Inventory</BodyText>
            <View style={styles.chartRow}>
              <View style={styles.pieWrap}>
                <MiniPieChart items={slabs} colors={SLAB_COLORS} total={totalSlabs} />
                <View style={styles.totalLabel}>
                  <BodyText style={styles.totalNum}>{totalSlabs}</BodyText>
                  <BodyText style={styles.totalText}>Total</BodyText>
                </View>
              </View>
              <LegendItems items={slabs} colors={SLAB_COLORS} />
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Generics */}
          <View style={styles.section}>
            <BodyText style={styles.sectionLabel}>Generic Inventory</BodyText>
            <View style={styles.chartRow}>
              <View style={styles.pieWrap}>
                <MiniPieChart items={generics} colors={GENERIC_COLORS} total={totalGenerics} />
                <View style={styles.totalLabel}>
                  <BodyText style={styles.totalNum}>{totalGenerics}</BodyText>
                  <BodyText style={styles.totalText}>Total</BodyText>
                </View>
              </View>
              <LegendItems items={generics} colors={GENERIC_COLORS} />
            </View>
          </View>
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
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  body: { gap: theme.spacing.md },
  loadingWrap: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: 6 },
  sectionLabel: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: '#475569',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieWrap: {
    width: PIE_SIZE,
    height: PIE_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalNum: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    lineHeight: 16,
  },
  totalText: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    borderStyle: 'dashed',
  },
});
