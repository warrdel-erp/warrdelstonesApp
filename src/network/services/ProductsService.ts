import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';
import { ProductResponse } from '../../types/ProductTypes.ts';
import { AddProductForm } from '../../screens/products/AddProductScreen.tsx';

export type PaginationParams = {
  page: number;
  limit: number;
  status?: 'active' | 'inActive';
};

export type AddProductPayload = {
  name: string;
  kind: number;
  baseColorId?: number;
  origin?: number;
  thickness?: number;
  categoryId: string;
  uom: number;
  groupId?: number;
  finishId?: number;
  subCategoryId: number;
  weight?: string;
  alternativeName: string;
  singleUnitPrice: string;
  bundlePrice: string;
  binId: number;
  reorderQuantity: string;
  safetyQuantity: string;
  leadTime: string;
  notes: string;
  instructions: string;
  disclaimer: string;
  isSlabType: boolean;
};

export type CompactProductList = {
  onlyWithSlabs: 1 | 0;
};
export class ProductsService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getProducts(paginationParams: PaginationParams): Promise<ApiResponse<ProductResponse>> {
    const params = DataMapUtils.objectToParams(paginationParams);
    return this.makeRequest(() => this.apiClient.get(`/api/product`, { params }));
  }

  async addProduct(addProductPayload: AddProductPayload): Promise<ApiResponse<ProductResponse>> {
    return this.makeRequest(() => this.apiClient.post(`/api/product`, addProductPayload));
  }

  async getCompactProducts(filter: CompactProductList): Promise<ApiResponse<ProductResponse>> {
    const params = DataMapUtils.objectToParams(filter);
    return this.makeRequest(() => this.apiClient.post(`/api/product/compact`, { params }));
  }
}
