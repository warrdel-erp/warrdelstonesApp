import { authContextManager } from './AuthContextManager';
import AsyncStorageUtils, { STORAGE_KEYS } from './AsyncStorageUtils.ts';
import { showErrorToast } from './ToastService.ts';

class AuthManager {
  private static instance: AuthManager;

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  // Method to handle token expiration and logout
  async handleTokenExpired() {
    try {
      showErrorToast('Your session has expired. Please log in again.');
      console.log('🔒 Token expired - logging out user');

      // store.dispatch(logoutUser());

      await AsyncStorageUtils.remove(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorageUtils.remove(STORAGE_KEYS.USER_AUTH_STATE);

      authContextManager.logout();
    } catch (error) {
      console.error('Error during token expiration handling:', error);
    }
  }
}

export const authManager = AuthManager.getInstance();
