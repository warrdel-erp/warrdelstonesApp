import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { services } from '../../network';
import {
  AuthResponse,
  AuthUserData,
  LoginCredentials,
  ClientUser,
} from '../../network/services/AuthService.ts';
import { AsyncStorageUtils, STORAGE_KEYS } from '../../utils';
import { createThunkFromApiResult } from '../utils/thunkHelpers.ts';

export interface AuthData {
  authResponse?: AuthUserData;
  loginUserDetail?: ClientUser;
  isLoading: boolean;
  error?: string;
}

// Initial state
const initialState: AuthData = {
  authResponse: undefined,
  loginUserDetail: undefined,
  isLoading: false,
  error: undefined,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.auth.login(credentials), rejectWithValue);
  },
);

export const getUserDetail = createAsyncThunk(
  'auth/getUserDetail',
  async (userId: number, { rejectWithValue }) => {
    return createThunkFromApiResult(() => services.auth.getUser(userId), rejectWithValue);
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  return createThunkFromApiResult(() => services.auth.logout(), rejectWithValue);
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthResponse | undefined>) => {
      state.authResponse = action.payload?.data;
      state.isLoading = false;
      state.error = undefined;
      AsyncStorageUtils.setBoolean(STORAGE_KEYS.IS_AUTHENTICATED, !!action.payload);
      AsyncStorageUtils.setObject(STORAGE_KEYS.USER_AUTH_STATE, action.payload);
    },
    // Action to clear authentication state
    clearAuthState: state => {
      state.authResponse = undefined;
      state.isLoading = false;
      state.error = undefined;
      AsyncStorageUtils.setBoolean(STORAGE_KEYS.IS_AUTHENTICATED, false);
      AsyncStorageUtils.remove(STORAGE_KEYS.USER_AUTH_STATE);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = undefined;
        state.authResponse = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authResponse = action.payload?.data ?? undefined;
        state.error = undefined;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.loginUserDetail = action.payload ?? undefined;
        state.error = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Failed to login: ' + (action.payload as string);
      });

    // Logout cases
    builder.addCase(logoutUser.fulfilled, state => {
      state.authResponse = undefined;
      state.error = undefined;
      state.isLoading = false;
    });
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
