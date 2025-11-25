import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { store, persistor } from './index';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ReduxProvider;
