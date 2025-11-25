import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STORAGE_KEYS, AsyncStorageUtils } from '../utils';
import { AuthResponse, AuthUserData } from '../network/services/AuthService.ts';
import { useAppDispatch } from '../store/hooks.ts';
import { getUserDetail } from '../store/slices/authSlice.ts';
import { useAppActions } from '../hooks/useAppActions.ts';

interface AuthContextType {
  isAuthenticated: boolean;
  authState: AuthUserData | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authState, setAuthState] = useState<AuthUserData | null>(null);
  const [loading, setLoading] = useState(false);
  useAppActions();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (authState?.user) {
      dispatch(getUserDetail(authState.user.clientId));
      setLoading(false);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [authState]);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await AsyncStorageUtils.getBoolean(STORAGE_KEYS.IS_AUTHENTICATED, false);
      if (isAuth) {
        const storedAuthState = await AsyncStorageUtils.getObject<AuthUserData>(
          STORAGE_KEYS.USER_AUTH_STATE,
        );
        if (storedAuthState) {
          setAuthState(storedAuthState);
        } else {
          setAuthState(null);
        }
      } else {
        setAuthState(null);
        setLoading(false);
      }
    } catch (error) {
      setAuthState(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const login = (authState: AuthResponse) => {
    setAuthState(authState.data);
    AsyncStorageUtils.setBoolean(STORAGE_KEYS.IS_AUTHENTICATED, true);
    AsyncStorageUtils.setObject(STORAGE_KEYS.USER_AUTH_STATE, authState.data);
  };

  const logout = () => {
    setAuthState(null);
    AsyncStorageUtils.setBoolean(STORAGE_KEYS.IS_AUTHENTICATED, false);
    AsyncStorageUtils.remove(STORAGE_KEYS.USER_AUTH_STATE);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authState,
        login,
        logout,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
