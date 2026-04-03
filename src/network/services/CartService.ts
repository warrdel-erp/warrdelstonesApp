import { MutationResponse } from '../../types/CommonTypes.ts';
import { ApiClient } from '../base/ApiClient';
import { BaseService } from '../base/BaseService';
import { ApiResponse } from '../types/ApiResponseTypes.ts';

export class CartService extends BaseService {
  constructor(apiClient: ApiClient) {
    super(apiClient);
  }

  /**
   * Adds an inventory product to the cart.
   * @param inventoryProductId ID of the inventory product to add.
   */
  async addToCart(inventoryProductId: number): Promise<ApiResponse<MutationResponse>> {
    return this.makeRequest(() =>
      this.apiClient.post('/api/cartItem', { inventoryProductId }),
    );
  }

  /**
   * Removes an item from the cart.
   * @param cartItemId ID of the cart item to remove.
   */
  async removeFromCart(cartItemId: number): Promise<ApiResponse<MutationResponse>> {
    return this.makeRequest(() =>
      this.apiClient.delete(`/api/cartItem/${cartItemId}`),
    );
  }

  /**
   * Fetches all cart items.
   */
  async getCartItems(): Promise<ApiResponse<any>> {
    return this.makeRequest(() => this.apiClient.get('/api/cartItem'));
  }
}
