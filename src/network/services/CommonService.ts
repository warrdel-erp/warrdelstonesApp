import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import {
  BasePageRequest,
  Bin,
  BinsResponse,
  ClientUsersResponse,
  CustomersAmounts,
  CustomersAmountsResponse,
  GeneralDataResponse,
  LocationsResponse,
  OpenPosResponse,
  PaginatedResponse,
  ProductAccounts,
  ProductAccountsResponse,
  VendorsAmounts,
  VendorsAmountsResponse,
} from '../../types/CommonTypes.ts';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import { InventoryResponse, PaginationData } from '../../types/InventoryTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';

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
}
