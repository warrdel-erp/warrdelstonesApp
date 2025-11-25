import { store } from './index';

/**
 * Get current state values without subscribing
 */
export const getCurrentState = () => store.getState();

/**
 * Get auth token
 */
export const getAuthToken = () => {
  const state = getCurrentState();
  return state.auth.authResponse?.token;
};
