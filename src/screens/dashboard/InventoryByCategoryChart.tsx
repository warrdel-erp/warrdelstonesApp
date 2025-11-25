import React from 'react';
import { Dimensions, View } from 'react-native';
import theme from '../../theme';
import { Caption, Heading5 } from '../../components/ui';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Card from '../../components/ui/Card.tsx';
import { ChartLegendsList } from './ChartLegendsList.tsx';

export const InventoryByCategoryChart: React.FC = () => {
  return (
    <Card>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingVertical: theme.spacing.sm,
        }}>
        <Heading5>Inventory by Category (SF)</Heading5>
      </View>
      <BarChart
        data={data}
        yAxisSuffix={' SF'}
        width={Dimensions.get('window').width - theme.spacing.md * 2}
        height={200}
        fromZero={true}
        yAxisLabel=""
        chartConfig={chartConfig}
      />
    </Card>
  );
};

const chartConfig = {
  backgroundGradientFrom: theme.colors.white,
  backgroundGradientTo: theme.colors.white,
  fillShadowGradientFrom: theme.colors.primaryLight,
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientTo: theme.colors.primaryLight,
  fillShadowGradientToOpacity: 1,
  color: (opacity = 1) => theme.colors.black,
  propsForBackgroundLines: {
    strokeDasharray: '10 0', // This creates a dashed line pattern (4 units solid, 4 units space)
    stroke: theme.colors.border.medium, // Color of the dashed line
    strokeWidth: 0.5, // Width of the dashed line
  },
};
const data = {
  labels: ['Granite', 'Marble', 'Quartz', 'Limestone'],
  datasets: [
    {
      data: [46, 25, 40, 52],
    },
  ],
};
