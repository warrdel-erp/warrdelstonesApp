import { useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext.tsx';
import { AuthResponse } from '../network/services/AuthService.ts';
import { useAppDispatch } from '../store/hooks.ts';
import { clearAuthState, getMe, setAuthState } from '../store/slices/authSlice.ts';
import { authContextManager } from '../utils/AuthContextManager.ts';

/**
 * Custom hook for authentication operations
 */
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  const authContext = useAuthContext();

  useEffect(() => {
    authContextManager.setLogoutCallback(authContext.logout);
    authContextManager.setLoginCallback(authContext.login);
  }, []);

  const loginUser = (authResponse: AuthResponse) => {
    dispatch(setAuthState(authResponse));
    dispatch(getMe(authResponse.data.token));
    authContext.login(authResponse);
  };

  const logoutUser = () => {
    dispatch(clearAuthState());
    authContext.logout();
  };

  return {
    loginUser,
    logoutUser,
  };
};
