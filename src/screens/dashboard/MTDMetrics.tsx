import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { BodyText, Heading4 } from '../../components/ui';
import theme from '../../theme';
import Svg, { Path } from 'react-native-svg';

const METRICS = [
  {
    id: 'revenue',
    title: 'Revenue (MTD)',
    value: '$234,210',
    growth: '+ 12.5%',
    color: '#3B82F6',
    chartData: 'M0 30 Q10 25 20 28 T40 20 T60 25 T80 15 T100 22',
  },
  {
    id: 'orders',
    title: 'Orders (MTD)',
    value: '728',
    growth: '+ 8.4%',
    color: '#10B981',
    chartData: 'M0 30 Q10 20 20 25 T40 15 T60 20 T80 10 T100 18',
  },
  {
    id: 'dispatch',
    title: 'Pending Dispatch',
    value: '28',
    growth: '+ 5.2%',
    color: '#8B5CF6',
    chartData: 'M0 25 Q10 28 20 20 T40 25 T60 15 T80 22 T100 10',
  },
];

export const MTDMetrics: React.FC = () => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {METRICS.map((metric) => (
        <View key={metric.id} style={styles.card}>
          <BodyText style={styles.title}>{metric.title}</BodyText>
          <Heading4 style={styles.value}>{metric.value}</Heading4>
          <BodyText style={[styles.growth, { color: metric.color }]}>{metric.growth}</BodyText>
          <View style={styles.chartContainer}>
            <Svg height="40" width="100%">
              <Path
                d={metric.chartData}
                fill="none"
                stroke={metric.color}
                strokeWidth="2"
              />
            </Svg>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    width: 150,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  growth: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 2,
  },
  chartContainer: {
    marginTop: theme.spacing.sm,
    height: 40,
    width: '100%',
  },
});
