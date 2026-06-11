import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Menu } from '@tamagui/lucide-icons';
import { Heading4, Badge } from '../../components/ui';
import theme from '../../theme';

interface DashboardHeaderProps {
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  profileImage?: string;
  notificationCount?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  profileImage = 'https://i.pravatar.cc/150?u=chris',
  notificationCount = 3,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
          <Menu size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Heading4 style={styles.title}>Home</Heading4>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
          <View>
            <Bell size={24} color={theme.colors.text.primary} />
            {notificationCount > 0 && (
              <View style={styles.badgeContainer}>
                <Badge 
                   label={notificationCount.toString()} 
                   variant="error"
                   style={styles.badge}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  badgeContainer: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.status.success,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
});
