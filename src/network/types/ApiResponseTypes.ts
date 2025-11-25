export interface ApiResponse<T> {
  success: boolean;
  status: number;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string[];
  errorCode: string;
}

export const isApiSuccess = <T>(response: ApiResponse<T>): boolean => {
  return response.status >= 200 && response.status < 300;
};
