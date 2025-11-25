import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authSlice from './slices/authSlice';
import appSlice from './slices/appSlice';
import inventorySlice from './slices/inventorySlice.ts';

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user'], // Only persist auth and user data
  blacklist: ['app'], // Don't persist app state (loading states, etc.)
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  app: appSlice,
  inventory: inventorySlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__, // Enable Redux DevTools in development
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
