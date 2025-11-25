import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ProductResponse } from '../../types/ProductTypes.ts';
import { VendorsResponse } from '../../types/VendorTypes.ts';
import { AddVendorForm } from '../../screens/suppliers/AddSupplierScreen.tsx';
import { CustomersResponse } from '../../types/CustomerTypes.ts';
import { ServiceOrderResponse } from '../../types/SalesOrderTypes.ts';

export type SalesOrdersFilter = {
  page?: number;
  limit?: number;
  tab: '' | 'PENDING_PAYMENT' | 'LOADING_ORDER' | 'PACKAGING_LIST' | 'OPEN' | 'CLOSED';
  search?: string;
};

export type LedgerAccFilter = {
  subHeaderId: number;
};

export type SubProductsFilter = {
  productId: number;
  isHold: boolean;
  status: 'IN_INVENTORY';
};

export type AdvanceDepositPayload = {
  amount: number;
  salesOrderId: number;
  paymentMethod: string;
  accountId: number;
};

export type AddTruckPayload = {
  name: string;
  vehilceType: 'light' | 'medium' | 'heavy';
  registrationNumber: string;
  registrationDate: string;
  capacity: string;
};

export type DeliveryFilter = {
  status: 'pending' | 'approved';
};

export type ReturnFilter = {
  status: 'initiated' | 'complete' | 'canceled';
};

export type TrucksFilter = {
  notAssignedOnly: boolean;
  page: number;
  limit: number;
};

export type ReturnPayload = { invoiceId: number; productIds: number[] };
export type UpdateReturnPayload = { productIds: number[] };

export class SalesOrderService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getSalesOrders(
    salesOrdersFilter: SalesOrdersFilter,
  ): Promise<ApiResponse<ServiceOrderResponse>> {
    const params = DataMapUtils.objectToParams(salesOrdersFilter);
    return this.makeRequest(() => this.apiClient.get(`/api/salesOrder`, { params }));
  }

  async getLedgerAccounts(
    ledgerAccFilter: LedgerAccFilter,
  ): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(ledgerAccFilter);
    return this.makeRequest(() => this.apiClient.get(`/api/ledgerAccount`, { params }));
  }

  async salesOrderPaidAmt(soId: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/salesOrder/paidAmount/${soId}`));
  }
  async salesOrder(soId: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/salesOrder/${soId}`));
  }

  async subProducts(filter: SubProductsFilter): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.get(`/api/inventoryProduct`, { params }));
  }

  async advanceDeposit(payload: AdvanceDepositPayload): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/advancedDeposit`, payload));
  }

  async soInvoices(): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/soInvoice`));
  }
  async addTruck(payload: AddTruckPayload): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/truck`, payload));
  }
  async getDeliveries(filter: DeliveryFilter): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.get(`/api/delivery`, { params }));
  }
  async getFreeTrucks(filter: TrucksFilter): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.get(`/api/truck`, { params }));
  }
  async loadingOrder(invoiceId: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/loadingOrder/${invoiceId}`));
  }
  async returnInvoice(payload: ReturnPayload): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/return`, payload));
  }

  async getReturnInvoice(filter: ReturnFilter): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.get(`/api/return`, { params }));
  }

  async updateReturnedInvoice(
    invoiceId: number,
    payload: UpdateReturnPayload,
  ): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() =>
      this.apiClient.post(`/api/return/${invoiceId}/updateAndConfirm`, payload),
    );
  }
  async loadingOrdersAccToReturnConfirmation(
    invoiceId: number,
  ): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/loadingOrder/accordingToReturnConfirmation/${invoiceId}`),
    );
  }
}
