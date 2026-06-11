import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading2, BodyText } from '../../components/ui';
import theme from '../../theme';

interface GreetingProps {
  userName: string;
}

export const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  return (
    <View style={styles.container}>
      <BodyText style={styles.greetingText}>Good Morning,</BodyText>
      <Heading2 style={styles.userName}>{userName} 👋</Heading2>
      <BodyText style={styles.subText}>Here's what's happening today.</BodyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  greetingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
  },
  userName: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize['2xl'],
    color: theme.colors.text.primary,
  },
  subText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
});
