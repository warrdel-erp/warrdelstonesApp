import React from 'react';
import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { Caption } from '../../components/ui';

export type ChartLegendsListProps = {
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  dotStyle?: ViewStyle;
  labelStyle?: TextStyle;
  legends: { color: string; label: string }[];
};
export const ChartLegendsList: React.FC<ChartLegendsListProps> = props => {
  const renderLegendItem = (color: string, label: string) => {
    return (
      <View style={[styles.legendItem, props.itemStyle]} key={label}>
        <View style={[styles.dotStyle, { backgroundColor: color }, props.dotStyle]} />
        <Caption style={[styles.labelStyle, props.labelStyle]}>{label}</Caption>
      </View>
    );
  };

  return (
    <View style={[styles.container, props.style]}>
      {props.legends.map(item => {
        return renderLegendItem(item.color, item.label);
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: theme.spacing.none },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.status.success,
  },
  labelStyle: {
    color: theme.colors.text.disabled,
  },
});
