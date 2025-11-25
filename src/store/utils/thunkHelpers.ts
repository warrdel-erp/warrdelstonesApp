import { ApiError, ApiResponse, isApiSuccess } from '../../network/types/ApiResponseTypes';

/**
 * Helper function to create async thunk payloads from API results
 * Extracts success data or rejects with error message
 */
export const createThunkFromApiResult = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  rejectWithValue: (error?: ApiError) => any,
): Promise<T | undefined> => {
  const result = await apiCall();
  if (isApiSuccess(result)) {
    return result.data;
  } else {
    return rejectWithValue(result.error);
  }
};
