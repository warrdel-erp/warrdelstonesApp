import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import {
  EmployeePermission,
  ExistingEmail,
  UserData,
  UserPermission,
} from '../../types/AuthTypes.ts';
import { ApiResponse } from '../types/ApiResponseTypes.ts';

export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthUserData;
}

export interface AuthUserData {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  email: string;
  id: number;
  userid: string;
  clientId: number;
  accountType: string;
}

export type ClientUsers = ClientUser[];
export interface ClientUser {
  id: number;
  username: string;
  userid: string;
  phone: string;
  accountId: number;
  clientId: number;
  defaultLocationId: number;
  createdAt: Date;
  updatedAt: Date;
  client: Client;
  account: Account;
}

export interface Account {
  email: string;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  accountId: number;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
}

export interface Company {
  id: number;
  companyName: string;
  companyAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  contactPersonName: string;
  contactMobile: string;
  email: string;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.makeRequest(() =>
      this.apiClient.post('/api/auth/login', credentials, {
        headers: {
          Authorization: undefined,
        },
      }),
    );
  }

  async getUser(userId: number): Promise<ApiResponse<ClientUser>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/user/${userId}`, {
        headers: {
          Authorization: undefined,
        },
      }),
    );
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post('/auth/logout'));
  }
}
