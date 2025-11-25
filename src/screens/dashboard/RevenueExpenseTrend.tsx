import React from 'react';
import { Dimensions, View } from 'react-native';
import theme from '../../theme';
import { Caption, Heading5 } from '../../components/ui';
import { LineChart } from 'react-native-chart-kit';
import Card from '../../components/ui/Card.tsx';
import { ChartLegendsList } from './ChartLegendsList.tsx';

export const RevenueExpenseTrend: React.FC = () => {
  return (
    <Card>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: theme.spacing.sm,
        }}>
        <Heading5>Revenue & Expense Trend</Heading5>
        <ChartLegendsList
          legends={[
            { label: 'Profit', color: theme.colors.status.success },
            { label: 'Purchase', color: theme.colors.status.info },
            { label: 'Sales', color: theme.colors.status.error },
          ]}
        />
      </View>
      <LineChart
        chartConfig={chartConfig}
        data={data}
        bezier={true}
        yAxisLabel={'$'}
        withDots={false}
        fromZero={true}
        withScrollableDot={false}
        withVerticalLines={false}
        withOuterLines={false}
        width={Dimensions.get('window').width - theme.spacing.md * 2}
        height={200}
      />
    </Card>
  );
};

export const chartConfig = {
  backgroundGradientFrom: theme.colors.white,
  backgroundGradientTo: theme.colors.white,
  color: (opacity = 1) => theme.colors.black,
  strokeWidth: 1, // optional, default 3
  stackedBar: false,
  useShadowColorFromDataset: true,
  propsForBackgroundLines: {
    strokeDasharray: '10 0', // This creates a dashed line pattern (4 units solid, 4 units space)
    stroke: theme.colors.border.medium, // Color of the dashed line
    strokeWidth: 0.5, // Width of the dashed line
  },
};
export const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [46, 45, 42, 52, 54, 58],
      color: (opacity = 1) => theme.colors.status.success, // optional
      strokeWidth: 1, // optional
    },
    {
      data: [50, 40, 42, 48, 52, 51],
      color: (opacity = 1) => theme.colors.status.info, // optional
      strokeWidth: 1, // optional
    },
    {
      data: [23, 20, 22, 25, 25, 22],
      color: (opacity = 1) => theme.colors.status.error, // optional
      strokeWidth: 1, // optional
    },
  ],
};
