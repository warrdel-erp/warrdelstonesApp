import React from 'react';
import Card from '../../components/ui/Card.tsx';
import { BodyText, Caption, Heading4, Heading5, Heading6 } from '../../components/ui';
import Container from '../../components/ui/Container.tsx';
import theme from '../../theme';
import { ImageBackground, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface StatsCardProps {
  title: string;
  value: string;
  icon?: string;
  color?: string;
  titleStyle?: TextStyle;
  valueStyle?: TextStyle;
  style?: StyleProp<ViewStyle>;
  onClick?: () => void;
}
export const IconedStatsCard: React.FC<StatsCardProps> = props => {
  return (
    <Card
      style={{ padding: theme.spacing.sm, flex: 1, justifyContent: 'center' }}
      onClick={props.onClick}>
      <Container style={[styles.container, props.style]}>
        {props.icon && (
          <Icon
            name={props.icon}
            size={24}
            color={props.color || theme.colors.primary}
            style={{
              backgroundColor: (props.color ?? theme.colors.primary) + '33',
              padding: theme.spacing.sm,
              borderRadius: theme.spacing.sm,
            }}
          />
        )}
        <View style={{ justifyContent: 'space-between', flex: 1 }}>
          <BodyText style={[props.titleStyle, props.titleStyle]}>{props.title}</BodyText>
          <Heading5 style={[styles.value, props.valueStyle]}>{props.value}</Heading5>
        </View>
      </Container>
    </Card>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.sm,
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  title: { color: theme.colors.text.primary },
  value: { color: theme.colors.black, fontWeight: theme.typography.fontWeight.bold },
};
