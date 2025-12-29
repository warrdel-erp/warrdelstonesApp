import {
  BasePageRequest,
  BinsResponse,
  ClientUsersResponse,
  CustomersAmountsResponse,
  GeneralDataResponse,
  LocationsResponse,
  OpenPosResponse,
  PaginatedResponse,
  ProductAccountsResponse,
  VendorsAmountsResponse,
} from '../../types/CommonTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ApiClient } from '../base/ApiClient';
import { BaseService } from '../base/BaseService';
import { ApiResponse } from '../types/ApiResponseTypes.ts';

export type ChangePasswordPayload = {
  email: string;
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

export type ImageResponse = {
  key: string;
  body: string;
};

export type FromToDateFilter = {
  fromDate: string;
  toDate: string;
};

export class CommonService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getGeneralData(): Promise<ApiResponse<GeneralDataResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/general/data'));
  }

  async getAllLocations(): Promise<ApiResponse<LocationsResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/account/locations'));
  }

  async changePassword(request: ChangePasswordPayload): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post('/user/changePassword', request));
  }

  async getOpenPOs(): Promise<ApiResponse<OpenPosResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/dashboard/totalOpenPo'));
  }
  async getOpenSOs(): Promise<ApiResponse<OpenPosResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/dashboard/totalOpenSo'));
  }

  async getCustomerAmounts(): Promise<ApiResponse<CustomersAmountsResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/dashboard/totalCustomersAmounts'));
  }

  async getSalesAmount(filter: FromToDateFilter): Promise<ApiResponse<CustomersAmountsResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() =>
      this.apiClient.get('/api/dashboard/totalSalesAmount', { params }),
    );
  }

  async getPurchaseAmount(
    filter: FromToDateFilter,
  ): Promise<ApiResponse<CustomersAmountsResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() =>
      this.apiClient.get('/api/dashboard/totalPurchaseAmount', { params }),
    );
  }

  async getVendorsAmounts(): Promise<ApiResponse<VendorsAmountsResponse>> {
    return this.makeRequest(() => this.apiClient.get('/api/dashboard/totalVendorsAmounts'));
  }

  async getAllNotes(
    basePageRequest: BasePageRequest,
  ): Promise<ApiResponse<PaginatedResponse<any[]>>> {
    const params = DataMapUtils.objectToParams(basePageRequest);
    return this.makeRequest(() => this.apiClient.get('/api/notes', { params }));
  }

  async getBins(locationId: number): Promise<ApiResponse<BinsResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/bin/location/${locationId}`));
  }

  async getDefaultLedgerAccountsForProduct(): Promise<ApiResponse<ProductAccountsResponse>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/ledgerAccount/defaultLedgerAccountsForProduct`),
    );
  }

  async getClientUsers(): Promise<ApiResponse<ClientUsersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/user/clientUsers`));
  }

  async getOptions(
    endpoint: string,
    queryParams?: Record<string, any>,
  ): Promise<
    ApiResponse<{ success: boolean; message?: string; data: Array<{ label: string; value: any }> }>
  > {
    const params = queryParams ? DataMapUtils.objectToParams(queryParams) : undefined;
    return this.makeRequest(() =>
      this.apiClient.get(`/api/options/${endpoint}`, params ? { params } : undefined),
    );
  }
}
