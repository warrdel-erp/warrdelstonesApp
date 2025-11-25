import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme, textStyles } from '../theme';
import {
  NavigationTarget,
  ScreenId,
  ScreenIdType,
  StackIdType,
} from '../navigation/navigationConstants';
import NavigationService from '../navigation/NavigationService';

// BaseScreen component for screens that don't need custom headers
interface ScreenProps {
  title: string;
  icon: string;
  description?: string;
  quickActions?: Array<{
    title: string;
    stack?: StackIdType;
    route: ScreenIdType;
    icon: string;
    description: string;
  }>;
  navigation?: any;
}

const BaseScreen: React.FC<ScreenProps> = ({
  title,
  icon,
  description,
  quickActions,
  navigation,
}) => {
  // @ts-ignore
  const handleNavigate = (target: NavigationTarget | ScreenIdType, params?: any) => {
    NavigationService.navigate(target, params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name={icon} size={40} color={theme.colors.primary} />
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.contentText}>
          This is the {title} screen. Content will be implemented here.
        </Text>

        {quickActions && quickActions.length > 0 && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => handleNavigate(action)}
                activeOpacity={0.7}>
                <View style={styles.quickActionContent}>
                  <Icon
                    name={action.icon}
                    size={24}
                    color={theme.colors.primary}
                    style={styles.quickActionIcon}
                  />
                  <View style={styles.quickActionText}>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                    <Text style={styles.quickActionDescription}>{action.description}</Text>
                  </View>
                  <Icon name="arrow-forward" size={20} color={theme.colors.text.secondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.md,
  },
  title: {
    ...textStyles.h3,
    marginTop: theme.spacing.sm,
  },
  description: {
    ...textStyles.body1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  contentText: {
    ...textStyles.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
  quickActionsContainer: {
    marginTop: theme.spacing.xl,
  },
  quickActionsTitle: {
    ...textStyles.h5,
    marginBottom: theme.spacing.md,
    color: theme.colors.text.primary,
  },
  quickActionButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  quickActionIcon: {
    marginRight: theme.spacing.md,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    ...textStyles.body1,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs / 2,
  },
  quickActionDescription: {
    ...textStyles.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs / 2,
  },
});

export default BaseScreen;
