import { ApiClient, apiClient } from './base/ApiClient';
import { AuthService } from './services/AuthService';
import { CommonService } from './services/CommonService';
import { InventoryService } from './services/InventoryService.ts';
import { ProductsService } from './services/ProductsService.ts';
import { VendorService } from './services/VendorService.ts';
import { CustomersService } from './services/CustomersService.ts';
import { SalesOrderService } from './services/SalesOrderService.ts';

// Service registry to provide centralized access to all API services
export class ServiceRegistry {
  private static instance: ServiceRegistry;

  public readonly auth: AuthService;
  public readonly common: CommonService;
  public readonly inventory: InventoryService;
  public readonly products: ProductsService;
  public readonly vendors: VendorService;
  public readonly customers: CustomersService;
  public readonly sales: SalesOrderService;
  private constructor() {
    // Initialize all services with the shared singleton API client
    this.auth = new AuthService(apiClient);
    this.common = new CommonService(apiClient);
    this.inventory = new InventoryService(apiClient);
    this.products = new ProductsService(apiClient);
    this.vendors = new VendorService(apiClient);
    this.customers = new CustomersService(apiClient);
    this.sales = new SalesOrderService(apiClient);
  }

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  // Method to update base URL for all services
  public updateBaseURL(newBaseURL: string): void {
    apiClient.setBaseURL(newBaseURL);
  }

  // Method to get the ApiClient instance for advanced usage
  public getApiClient(): ApiClient {
    return apiClient;
  }
}

// Export singleton instance
export const services = ServiceRegistry.getInstance();

// Export the singleton ApiClient instance
export { apiClient };

// Export types
export type { ApiResponse } from './base/ApiClient';
