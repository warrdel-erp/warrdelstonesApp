import { CustomersResponse } from '../../types/CustomerTypes.ts';
import { ServiceOrderResponse } from '../../types/SalesOrderTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ApiClient } from '../base/ApiClient';
import { BaseService } from '../base/BaseService';
import { ApiResponse } from '../types/ApiResponseTypes.ts';

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
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  page?: number;
  limit?: number;
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

export type CreateLoadingOrderPayload = {
  lo?: number;
  loDate: string;
  expDeliveryDate: string;
  deliveryNotes?: string;
  internalNote?: string;
  deliveryType: string;
  shippingAddressId: number;
  paymentTermId?: number | null;
  customerId: number;
  salesOrderId: string;
  soProducts: Array<{
    id: string;
    loRemeasureLength?: number;
    loRemeasureWidth?: number;
  }>;
};

export type CreatePackagingListPayload = {
  plDate: string;
  loadingOrderId: string;
  soProducts: Array<{
    id: string;
    plRemeasureLength?: number;
    plRemeasureWidth?: number;
  }>;
};

export type InitiateDeliveryPayload = {
  loadingOrderIds: number[];
  truckId: number;
};

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

  async getSalesOrderForCreateLO(salesOrderId: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/salesOrder/${salesOrderId}/forCreateLO`),
    );
  }

  async createLoadingOrder(
    payload: CreateLoadingOrderPayload,
  ): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/loadingOrder`, payload));
  }

  async createPackagingList(
    payload: CreatePackagingListPayload,
  ): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/packagingList`, payload));
  }

  async createInvoiceFromLoadingOrder(
    loadingOrderId: number,
  ): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() =>
      this.apiClient.put(`/api/loadingOrder/${loadingOrderId}/createInvoice`),
    );
  }

  async packagingList(id: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/packagingList/${id}`));
  }

  async invoice(id: number): Promise<ApiResponse<CustomersResponse>> {
    return this.makeRequest(() => this.apiClient.get(`/api/invoice/${id}`));
  }

  async getLoadingOrders(filter: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<any>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.get(`/api/loadingOrder`, { params }));
  }

  async initiateDelivery(payload: InitiateDeliveryPayload): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post(`/api/delivery/initiate`, payload));
  }

  async approveDelivery(payload: {
    invoiceDeliveries: Array<{ id: number; order: number }>;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post(`/api/delivery/approve`, payload));
  }

  async rejectDelivery(deliveryId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post(`/api/delivery/reject/${deliveryId}`));
  }

  async completeDelivery(deliveryId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.post(`/api/delivery/complete/${deliveryId}`));
  }
}
