import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ProductResponse } from '../../types/ProductTypes.ts';
import { AddVendorForm } from '../../screens/suppliers/AddSupplierScreen.tsx';
import { CustomersResponse } from '../../types/CustomerTypes.ts';

export type CustomersFilter = {
  status?: 'active' | 'inActive';
};

export class CustomersService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getCustomersList(vendorFilter: CustomersFilter): Promise<ApiResponse<CustomersResponse>> {
    const params = DataMapUtils.objectToParams(vendorFilter);
    return this.makeRequest(() => this.apiClient.get(`/api/customer`, { params }));
  }
  async addCustomer(addVendorForm: AddVendorForm): Promise<ApiResponse<ProductResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/vendor`, addVendorForm));
  }
}
