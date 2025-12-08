/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Import theme
import { theme } from './src/theme';

// Import Redux Provider
import ReduxProvider from './src/store/ReduxProvider';

// Import navigation service
import { AuthProvider, useAuthContext } from './src/context/AuthContext';
import { navigationRef } from './src/navigation/NavigationService';

// Import Auth Navigator
import AuthNavigator from './src/navigation/AuthNavigator';

// Import all screen components
import Config from 'react-native-config';
import GooglePlacesSDK from 'react-native-google-places-sdk';
import SplashScreen from 'react-native-splash-screen';
import { useAuthActions } from './src/hooks';
import MainAppNavigator from './src/navigation/MainAppNavigator.tsx';

function AppContent() {
  const { isAuthenticated, loading } = useAuthContext();
  const insets = useSafeAreaInsets();
  useAuthActions();

  useEffect(() => {
    console.log('App started with Config:', Config.APP_ENV);
  }, []);

  useEffect(() => {
    GooglePlacesSDK.initialize(Config.GOOGLE_MAPS_API_KEY || '');
    SplashScreen.hide();
  }, []);

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.appContainer]}>
      {isAuthenticated ? <MainAppNavigator /> : <AuthNavigator />}
    </View>
  );
}

function App() {
  return (
    <ReduxProvider>
      <AuthProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.primaryDark} />
          <NavigationContainer ref={navigationRef}>
            <AppContent />
          </NavigationContainer>
          <Toast />
        </SafeAreaProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default App;
