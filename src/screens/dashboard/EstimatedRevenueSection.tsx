import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BodyText, Heading4 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAUGE_SIZE = 200;

const buildSemiArc = (pct: number, r: number, cx: number, cy: number, stroke: string, strokeW: number) => {
  // Draw a semi-circle arc (180deg from left to right)
  const angle = Math.PI * Math.min(pct / 100, 1);
  const startX = cx - r;
  const startY = cy;
  const endX = cx - r * Math.cos(angle);
  const endY = cy - r * Math.sin(angle);
  const largeArc = angle > Math.PI / 2 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
};

interface RevenueData {
  totalSoldAmount: number;
  totalLandedCost: number;
  estimatedRevenue: number;
}

export const EstimatedRevenueSection: React.FC = () => {
  const [data, setData] = useState<RevenueData>({
    totalSoldAmount: 0,
    totalLandedCost: 0,
    estimatedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getEstimatedRevenue();
        if (res?.data?.data) setData(res.data.data);
      } catch (err) {
        console.error('Estimated revenue error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  const { totalSoldAmount, totalLandedCost, estimatedRevenue } = data;
  const marginPct =
    totalSoldAmount > 0
      ? Math.round((estimatedRevenue / totalSoldAmount) * 100)
      : 0;
  const landedPct =
    totalSoldAmount > 0
      ? Math.round((totalLandedCost / totalSoldAmount) * 100)
      : 0;

  const cx = GAUGE_SIZE / 2;
  const cy = GAUGE_SIZE * 0.6;
  const r = GAUGE_SIZE * 0.38;

  const profitPath = buildSemiArc(marginPct, r, cx, cy, '#0D9488', 16);
  const bgPath = buildSemiArc(100, r, cx, cy, '#E2E8F0', 16);

  const fmt = (n: number) =>
    '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <BodyText style={styles.sectionTitle}>Estimated Revenue</BodyText>
          <BodyText style={styles.sectionSubtitle}>
            Profits from invoiced sales
          </BodyText>
        </View>
      </View>

      {loading ? (
        <View style={styles.gaugeWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={styles.gaugeWrap}>
          <Svg width={GAUGE_SIZE} height={GAUGE_SIZE * 0.65}>
            <Defs>
              <LinearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#14B8A6" />
                <Stop offset="100%" stopColor="#0D9488" />
              </LinearGradient>
            </Defs>
            {/* Background arc */}
            <Path d={bgPath} fill="none" stroke="#E2E8F0" strokeWidth={16} strokeLinecap="round" />
            {/* Profit arc */}
            <Path d={profitPath} fill="none" stroke="url(#gaugeGrad)" strokeWidth={16} strokeLinecap="round" />
          </Svg>
          <View style={styles.gaugeCenter}>
            <BodyText style={styles.gaugeCaptionText}>Profit Margin</BodyText>
            <Heading4 style={styles.gaugePct}>{marginPct}%</Heading4>
          </View>
        </View>
      )}

      {/* Progress bars */}
      <View style={styles.bars}>
        <ProgressRow
          label="Total Sold Amount"
          pctLabel="100%"
          value={fmt(totalSoldAmount)}
          pct={100}
          color="#0D9488"
        />
        <ProgressRow
          label="Landed Cost"
          pctLabel={`${landedPct}%`}
          value={fmt(totalLandedCost)}
          pct={landedPct}
          color="#2563EB"
        />
        <View style={styles.netRow}>
          <BodyText style={styles.netLabel}>Net Estimated Profit</BodyText>
          <BodyText style={styles.netValue}>{fmt(estimatedRevenue)}</BodyText>
        </View>
      </View>
    </View>
  );
};

const ProgressRow: React.FC<{
  label: string;
  pctLabel: string;
  value: string;
  pct: number;
  color: string;
}> = ({ label, pctLabel, value, pct, color }) => (
  <View style={styles.progRow}>
    <View style={styles.progHeader}>
      <BodyText style={styles.progLabel}>{label}</BodyText>
      <BodyText style={[styles.progPct, { color }]}>{pctLabel}</BodyText>
    </View>
    <BodyText style={[styles.progValue, { color }]}>{value}</BodyText>
    <View style={styles.progTrack}>
      <View
        style={[
          styles.progFill,
          { width: `${Math.min(100, pct)}%`, backgroundColor: color },
        ]}
      />
    </View>
  </View>
);

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
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  gaugeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: theme.spacing.sm,
  },
  gaugeCenter: {
    position: 'absolute',
    bottom: -4,
    alignItems: 'center',
  },
  gaugeCaptionText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  gaugePct: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    fontSize: 26,
  },
  bars: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  progRow: {
    gap: 4,
  },
  progHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  progPct: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  progValue: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.bold,
  },
  progTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progFill: {
    height: 6,
    borderRadius: 3,
  },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  netLabel: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  netValue: {
    fontSize: 15,
    fontFamily: theme.typography.fontFamily.extraBold,
    color: '#0D9488',
  },
});
