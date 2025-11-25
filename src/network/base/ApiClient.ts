import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthToken } from '../../store/utils';
import { authManager } from '../../utils/AuthManager';
import Config from 'react-native-config';

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor(baseURL: string = Config.BASE_API_URL as string) {
    this.baseURL = baseURL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(baseURL?: string): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseURL);
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token to requests
    this.axiosInstance.interceptors.request.use(
      config => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        this.logCurlRequest(config);
        console.log('🚀 API Request:', {
          method: config.method,
          url: config.url,
          params: config.params,
          data: config.data,
          headers: config.headers,
        });
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - Handle token refresh and errors
    this.axiosInstance.interceptors.response.use(
      response => {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          params: response.config.params,
          data: response.data,
        });
        return response;
      },
      async error => {
        console.log('❌ Response Error:', {
          status: error.response?.status,
          url: error.config?.url,
          params: error.config?.params,
          message: error.response?.data || error.message,
        });

        // Handle 401 errors (unauthorized) - Token expired
        if (error.response?.status === 401) {
          console.log('🔒 401 Unauthorized - Token expired, logging out...');

          // Use AuthManager to handle logout and navigation
          await authManager.handleTokenExpired();

          // Prevent further processing and reject with a clear message
          return Promise.reject(error);
        }

        return Promise.reject(error);
      },
    );
  }

  // Generic request method
  async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance(config);
    } catch (error) {
      throw error;
    }
  }

  logCurlRequest(config: AxiosRequestConfig) {
    return;
    let curlCommand = `curl -X ${config.method?.toUpperCase()} '${config.baseURL}${config.url}'`;

    // Add headers
    if (config.headers) {
      for (const headerName in config.headers) {
        // Exclude common headers that cURL automatically handles or are not relevant for direct copying
        if (
          headerName.toLowerCase() !== 'content-type' &&
          headerName.toLowerCase() !== 'accept' &&
          headerName.toLowerCase() !== 'user-agent'
        ) {
          curlCommand += ` -H '${headerName}: ${config.headers?.[headerName]}'`;
        }
      }
    }

    // Add data for POST/PUT requests
    if (config.data) {
      const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type'];
      if (contentType && contentType.includes('application/json')) {
        curlCommand += ` -H 'Content-Type: application/json' --data '${JSON.stringify(config.data)}'`;
      } else if (typeof config.data === 'string') {
        curlCommand += ` --data '${config.data}'`;
      }
    }

    console.log('cURL Command:', curlCommand);
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Upload file method
  async upload<T = any>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Update base URL
  setBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }

  // Get current axios instance (for advanced usage)
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create a singleton instance
export const apiClient = ApiClient.getInstance();
