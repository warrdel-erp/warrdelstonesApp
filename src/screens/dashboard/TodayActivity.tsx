import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { BodyText, Heading5, Badge } from '../../components/ui';
import theme from '../../theme';

const ACTIVITIES = [
  {
    id: 1,
    time: '09:00 AM',
    title: 'Order #ORD-2456 dispatched',
    description: 'Delhi Warehouse',
    status: 'Completed',
  },
  {
    id: 2,
    time: '10:45 AM',
    title: 'New inventory added',
    description: '24 slabs • White Marble',
    status: 'Completed',
  },
  {
    id: 3,
    time: '11:30 AM',
    title: 'Payment received',
    description: 'INV-1256 • $8,450',
    status: 'Completed',
  },
];

export const TodayActivity: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading5 style={styles.title}>Today's Activity</Heading5>
        <TouchableOpacity>
          <BodyText style={styles.viewAllText}>View All</BodyText>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {ACTIVITIES.map((activity, index) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.timelineContainer}>
              <View style={styles.dot} />
              {index !== ACTIVITIES.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.timeSection}>
              <BodyText style={styles.timeText}>{activity.time}</BodyText>
            </View>
            <View style={styles.contentSection}>
              <BodyText style={styles.activityTitle}>{activity.title}</BodyText>
              <BodyText style={styles.activityDesc}>{activity.description}</BodyText>
            </View>
            <View style={styles.statusSection}>
              <Badge 
                label={activity.status} 
                variant="success" 
                style={styles.statusBadge}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  viewAllText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    minHeight: 50,
  },
  timelineContainer: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 14,
    bottom: -15,
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  timeSection: {
    width: 75,
    paddingLeft: theme.spacing.xs,
  },
  timeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginTop: 2,
  },
  contentSection: {
    flex: 1,
    paddingRight: theme.spacing.xs,
  },
  activityTitle: {
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  activityDesc: {
    fontSize: 11,
    color: theme.colors.primary,
    marginTop: 2,
  },
  statusSection: {
    justifyContent: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#ECFDF5',
  },
});
