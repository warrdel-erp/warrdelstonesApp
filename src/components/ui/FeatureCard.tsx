import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import theme from '../../theme';
import { BodyText, Caption } from './Typography.tsx';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  style?: ViewStyle;
}
export const FeatureCard: React.FC<FeatureCardProps> = props => {
  return (
    <View style={[styles.container, props.style]}>
      <Icon name={props.iconName} size={22} color={theme.colors.white} />
      <View style={styles.textContainer}>
        <BodyText style={styles.title} numberOfLines={0}>
          {props.title}
        </BodyText>
        <Caption style={styles.subtitle} numberOfLines={0}>
          {props.description}
        </Caption>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.transparent,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 8,
  },
  title: {
    color: theme.colors.white,
  },
  subtitle: {
    color: theme.colors.text.muted,
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
});
