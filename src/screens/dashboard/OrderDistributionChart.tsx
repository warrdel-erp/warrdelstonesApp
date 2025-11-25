import React from 'react';
import { Dimensions, View } from 'react-native';
import theme from '../../theme';
import { Caption, Heading5 } from '../../components/ui';
import { LineChart, PieChart } from 'react-native-chart-kit';
import Card from '../../components/ui/Card.tsx';
import { ChartLegendsList } from './ChartLegendsList.tsx';

export const OrderDistributionChart: React.FC = () => {
  return (
    <Card>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: theme.spacing.sm,
        }}>
        <Heading5>Order Distribution</Heading5>
      </View>
      <PieChart
        data={data}
        width={Dimensions.get('window').width - theme.spacing.md * 2}
        height={200}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'0'}
        absolute={false}
      />
    </Card>
  );
};

const chartConfig = {
  backgroundGradientFrom: theme.colors.white,
  backgroundGradientTo: theme.colors.white,
  color: (opacity = 1) => theme.colors.black,
  // strokeWidth: 1, // optional, default 3
  stackedBar: false,
  propsForBackgroundLines: {
    strokeDasharray: '10 0', // This creates a dashed line pattern (4 units solid, 4 units space)
    stroke: theme.colors.border.medium, // Color of the dashed line
    strokeWidth: 0.5, // Width of the dashed line
  },
};

const data = [
  {
    name: 'Open POs',
    population: 4,
    color: theme.colors.yellow,
    legendFontColor: theme.colors.text.disabled,
    legendFontSize: 12,
  },
  {
    name: 'Open SOs',
    population: 4,
    color: theme.colors.status.warning,
    legendFontColor: theme.colors.text.disabled,
    legendFontSize: 12,
  },
  {
    name: 'In Transit',
    population: 2,
    color: theme.colors.status.info,
    legendFontColor: theme.colors.text.disabled,
    legendFontSize: 12,
  },
  {
    name: 'Completed',
    population: 8,
    color: theme.colors.status.success,
    legendFontColor: theme.colors.text.disabled,
    legendFontSize: 12,
  },
];
