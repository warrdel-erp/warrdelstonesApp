import { ApiClient } from './ApiClient';
import { ApiResponse } from '../types/ApiResponseTypes';
import axios, { AxiosResponse } from 'axios';

export abstract class BaseService {
  protected apiClient: ApiClient;

  protected constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  protected async makeRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await requestFn();
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  protected handleError(error: any): ApiResponse<never> {
    let errorMessage: string;
    let status = 500;
    let code: string | undefined;

    if (error.response) {
      status = error.response.status;
      errorMessage = error.response.data || error.response.data?.error || `Server error: ${status}`;
      code = error.response.status;
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error - please check your connection';
      status = 0;
      code = 'NETWORK_ERROR';
    } else {
      errorMessage = error.message || 'Unknown error occurred';
    }
    return {
      success: false,
      error: {
        message: Array.isArray(errorMessage) ? errorMessage : [errorMessage],
        errorCode: code || 'UNKNOWN_ERROR',
      },
      data: undefined,
      status: status,
    };
  }
}
