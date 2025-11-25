import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { theme, textStyles } from '../../theme';
import { useScreenContext } from '../../context/ScreenContext.tsx';
import NavigationService from '../../navigation/NavigationService.ts';
import { ScreenId } from '../../navigation/navigationConstants.ts';

// Enhanced Settings Screen with profile interaction
const SettingsScreen: React.FC = ({ navigation }: any) => {
  const { updateState, registerActions } = useScreenContext();
  const [userData] = useState({
    name: 'Admin User',
    email: 'admin@myschool.com',
    avatar: true,
  });

  useEffect(() => {
    updateState({
      showBackButton: false,
      userData: userData,
    });

    registerActions({
      onProfilePress: () => {
        Alert.alert('Profile Menu', 'Choose an action', [
          {
            text: 'View Profile',
            onPress: () => NavigationService.navigate(ScreenId.PROFILE),
          },
          {
            text: 'Edit Profile',
            onPress: () => Alert.alert('Edit', 'Edit profile form would open'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      },
    });
  }, [updateState, registerActions, userData]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.contentText}>
          Settings screen with interactive header. Tap the profile avatar in the header!
        </Text>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <Text style={styles.userInfo}>Name: {userData.name}</Text>
          <Text style={styles.userInfo}>Email: {userData.email}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  settingsSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h5,
    marginBottom: theme.spacing.md,
  },
  userInfo: {
    ...textStyles.body1,
    marginBottom: theme.spacing.sm,
  },
});

export default SettingsScreen;
