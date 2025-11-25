import React from 'react';
import Card from '../../components/ui/Card.tsx';
import { BodyText, Caption, Heading2, Heading4, Heading5, Heading6 } from '../../components/ui';
import Container from '../../components/ui/Container.tsx';
import theme from '../../theme';
import { ImageBackground, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Separator from '../../components/ui/Separator.tsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface StatsCardProps {
  title: string;
  value: string;
  bottomTitle: string;
  bottomValue: string;
  trendingValue?: string;
  trendingUp: boolean;
  icon: string;
  color?: string;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  onClick?: () => void;
}
export const StatsCard: React.FC<StatsCardProps> = props => {
  return (
    <Card style={{ padding: theme.spacing.sm, flex: 1 }} onClick={props.onClick}>
      <Container style={[styles.container, props.style]}>
        <View style={{ gap: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Icon
              name={props.icon}
              size={44}
              color={props.color || theme.colors.primary}
              style={{
                backgroundColor: (props.color ?? theme.colors.primary) + '33',
                padding: theme.spacing.sm,
                borderRadius: theme.spacing.sm,
              }}
            />
            {props.trendingValue && (
              <View
                style={{
                  flexDirection: 'row',
                  height: 28,
                  borderRadius: theme.spacing.xs,
                  paddingHorizontal: theme.spacing.sm,
                  backgroundColor:
                    (props.trendingUp ? theme.colors.status.success : theme.colors.status.error) +
                    '22',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Icon
                  name={props.trendingUp ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={props.trendingUp ? theme.colors.status.success : theme.colors.status.error}
                />
                <Caption
                  style={{
                    color: props.trendingUp
                      ? theme.colors.status.success
                      : theme.colors.status.error,
                  }}>
                  {props.trendingValue}
                </Caption>
              </View>
            )}
          </View>
          <View>
            <Heading5>{props.title}</Heading5>
            <Heading2>{props.value}</Heading2>
          </View>
        </View>
        <Separator />
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <BodyText>{props.bottomTitle}</BodyText>
          <Heading6>{props.bottomValue}</Heading6>
        </View>
      </Container>
    </Card>
  );
};

const styles = {
  container: {
    flexDirection: 'column',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
  },
};
