import { AuthResponse, AuthUserData } from '../network/services/AuthService';

// Global reference to AuthContext methods
class AuthContextManager {
  private static instance: AuthContextManager;
  private logoutCallback: (() => void) | null = null;
  private loginCallback: ((userData: AuthUserData) => void) | null = null;

  public static getInstance(): AuthContextManager {
    if (!AuthContextManager.instance) {
      AuthContextManager.instance = new AuthContextManager();
    }
    return AuthContextManager.instance;
  }

  // Register the logout callback from AuthContext
  setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback;
  }

  // Register the login callback from AuthContext
  setLoginCallback(callback: (userData: AuthUserData) => void) {
    this.loginCallback = callback;
  }

  logout() {
    if (this.logoutCallback) {
      this.logoutCallback();
    } else {
      console.warn('⚠️ AuthContextManager: No logout callback registered');
    }
  }
}

export const authContextManager = AuthContextManager.getInstance();
