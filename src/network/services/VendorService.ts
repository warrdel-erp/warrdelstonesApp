import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ProductResponse } from '../../types/ProductTypes.ts';
import { AddProductForm } from '../../screens/products/AddProductScreen.tsx';
import { VendorsResponse } from '../../types/VendorTypes.ts';
import { AddProductPayload } from './ProductsService.ts';
import { AddVendorForm } from '../../screens/suppliers/AddSupplierScreen.tsx';

export type VendorFilter = {
  type: string;
  status?: string;
};

export class VendorService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getVendorsList(vendorFilter: VendorFilter): Promise<ApiResponse<VendorsResponse>> {
    const params = DataMapUtils.objectToParams(vendorFilter);
    return this.makeRequest(() => this.apiClient.get(`/api/vendor`, { params }));
  }
  async addVendor(addVendorForm: AddVendorForm): Promise<ApiResponse<ProductResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/vendor`, addVendorForm));
  }
}
