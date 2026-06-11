import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { BodyText, Heading4 } from '../../components/ui';
import theme from '../../theme';
import { dashboardService } from '../../network/services/DashboardService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 180;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

interface ChartPoint {
  name: string;
  profit: number;
}

const buildPath = (points: ChartPoint[]): { line: string; fill: string } => {
  if (!points.length) return { line: '', fill: '' };
  const plotW = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;
  const maxVal = Math.max(...points.map(p => p.profit), 1);

  const coords = points.map((p, i) => ({
    x: PAD_LEFT + (i / (points.length - 1)) * plotW,
    y: PAD_TOP + plotH - (p.profit / maxVal) * plotH,
  }));

  let line = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    const cx = (coords[i - 1].x + coords[i].x) / 2;
    line += ` C ${cx} ${coords[i - 1].y} ${cx} ${coords[i].y} ${coords[i].x} ${coords[i].y}`;
  }

  const fill =
    line +
    ` L ${coords[coords.length - 1].x} ${PAD_TOP + plotH}` +
    ` L ${coords[0].x} ${PAD_TOP + plotH} Z`;

  return { line, fill };
};

export const StatisticsSection: React.FC = () => {
  const [data, setData] = useState<{
    chartData: ChartPoint[];
    currentMonthProfit: number;
    percentageChange: number;
  }>({ chartData: [], currentMonthProfit: 0, percentageChange: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await dashboardService.getMonthlyProfitStats();
        if (res?.data?.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Statistics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    void fetch();
  }, []);

  const { line, fill } = buildPath(data.chartData);
  const isPositive = data.percentageChange >= 0;
  const changeColor = isPositive ? '#10B981' : '#EF4444';
  const changeBg = isPositive ? '#D1FAE5' : '#FEE2E2';
  const changeSign = isPositive ? '+' : '';

  // X-axis labels (show every other label to avoid crowding)
  const labels = data.chartData.filter((_, i) => i % 2 === 0);
  const plotW = CHART_WIDTH - PAD_LEFT - PAD_RIGHT;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <BodyText style={styles.sectionTitle}>Statistics</BodyText>
          <BodyText style={styles.sectionSubtitle}>
            Monthly profit from sales invoices
          </BodyText>
        </View>
        <View style={styles.badge}>
          <BodyText style={styles.badgeText}>Monthly</BodyText>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Heading4 style={styles.profitValue}>
          ${Number(data.currentMonthProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Heading4>
        <View style={[styles.changePill, { backgroundColor: changeBg }]}>
          <BodyText style={[styles.changeText, { color: changeColor }]}>
            {changeSign}{data.percentageChange}%
          </BodyText>
        </View>
      </View>
      <BodyText style={styles.captionText}>Monthly Profit</BodyText>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : data.chartData.length === 0 ? (
        <View style={styles.loadingWrap}>
          <BodyText style={{ color: theme.colors.text.secondary }}>No data</BodyText>
        </View>
      ) : (
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.chart}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#4338CA" stopOpacity={0.18} />
              <Stop offset="100%" stopColor="#4338CA" stopOpacity={0} />
            </LinearGradient>
          </Defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = PAD_TOP + (CHART_HEIGHT - PAD_TOP - PAD_BOTTOM) * ratio;
            return (
              <Path
                key={i}
                d={`M ${PAD_LEFT} ${y} L ${CHART_WIDTH - PAD_RIGHT} ${y}`}
                stroke="#E2E8F0"
                strokeWidth={1}
              />
            );
          })}
          {/* Fill */}
          <Path d={fill} fill="url(#grad)" />
          {/* Line */}
          <Path d={line} fill="none" stroke="#4338CA" strokeWidth={2.5} strokeLinecap="round" />
          {/* X-axis labels */}
          {labels.map((pt, i) => {
            const idx = data.chartData.indexOf(pt);
            const x = PAD_LEFT + (idx / (data.chartData.length - 1)) * plotW;
            return (
              <SvgText
                key={i}
                x={x}
                y={CHART_HEIGHT - 4}
                fontSize={9}
                fill="#94A3B8"
                textAnchor="middle">
                {pt.name}
              </SvgText>
            );
          })}
        </Svg>
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
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
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
  badge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  profitValue: {
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  changePill: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  changeText: {
    fontSize: 11,
    fontFamily: theme.typography.fontFamily.semiBold,
  },
  captionText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.md,
  },
  chart: {
    marginLeft: -theme.spacing.xs,
  },
  loadingWrap: {
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
