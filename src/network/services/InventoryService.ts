import { BaseService } from '../base/BaseService';
import { ApiClient } from '../base/ApiClient';
import { LocationsResponse, MutationResponse } from '../../types/CommonTypes.ts';
import { ApiResponse } from '../types/ApiResponseTypes.ts';
import {
  InventoryProductsResponse,
  InventoryResponse,
  ProductDetailResponse,
  SlabDetailResponse,
} from '../../types/InventoryTypes.ts';
import { DataMapUtils } from '../../utils/DataMapUtils.ts';

export type GetProductBy = {
  siplId?: number;
  block?: string;
  bundle?: string;
}

export type GetInventoryParams = {
  page: number;
  limit: number;
  categorization?: 'SIPL' | 'BUNDLE' | 'BLOCK';
}

export type GetInventoryRequest = {
  locationId: number;
  params: GetInventoryParams;
}

export type UpdateSellingPriceRequest = {
  ids: number[];
  sellingPrice: Number;
}
export class InventoryService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  async getInventory(getInventoryRequest: GetInventoryRequest): Promise<ApiResponse<InventoryResponse>> {
    const params = DataMapUtils.objectToParams(getInventoryRequest.params);
    return this.makeRequest(() =>
      this.apiClient.get(`/api/inventory/location/${getInventoryRequest.locationId}`, { params })
    );
  }

  async getProduct(productId: number): Promise<ApiResponse<ProductDetailResponse>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/product/${productId}`),
    );
  }
  async getSlab(slabId: number): Promise<ApiResponse<SlabDetailResponse>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/slab/${slabId}`),
    );
  }

  async getProductLandedCost(productId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/product/landedCost/${productId}`),
    );
  }

  async getLandedCost(id: number): Promise<ApiResponse<any>> {
    return this.makeRequest(() =>
      this.apiClient.get(`/api/landedCost/${id}`),
    );
  }

  async toggleSlabOnHold(slabId: number, isHold: boolean): Promise<ApiResponse<MutationResponse>> {
    return this.makeRequest(() =>
      this.apiClient.put(`/api/slab/${slabId}/hold`, {isHold}),
    );
  }

  async getInventoryProducts(byId: GetProductBy): Promise<ApiResponse<InventoryProductsResponse>> {
    const query = DataMapUtils.objectToParams(byId);
    return this.makeRequest(() =>
      this.apiClient.get(`/api/inventoryProduct/specialFilters`, { params: query }),
    );
  }

  async updateSellingPrice(request: UpdateSellingPriceRequest): Promise<ApiResponse<MutationResponse>> {
    return this.makeRequest(() =>
      this.apiClient.put(`/api/inventoryProduct/sellingPrice`, request),
    );
  }

  async addToCart(productId: number, isInCart: boolean): Promise<ApiResponse<MutationResponse>> {
    return this.makeRequest(() =>
      this.apiClient.put(`/api/inventoryProduct/${productId}/cart`, { isInCart }),
    );
  }
}
