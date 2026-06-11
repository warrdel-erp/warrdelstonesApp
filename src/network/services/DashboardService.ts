import { apiClient } from '../base/ApiClient';

export class DashboardService {
  async getTotalOpenPo() {
    return apiClient.get('/api/dashboard/totalOpenPo');
  }

  async getTotalOpenSo() {
    return apiClient.get('/api/dashboard/totalOpenSo');
  }

  async getPoInTransit() {
    return apiClient.get('/api/dashboard/totalPoInTransit');
  }

  // Monthly profit / statistics chart
  async getMonthlyProfitStats() {
    return apiClient.get('/api/dashboard/monthlyProfitStats');
  }

  // Estimated revenue gauge
  async getEstimatedRevenue() {
    return apiClient.get('/api/dashboard/estimatedRevenue');
  }

  // Inventory distribution pie
  async getCategoryWiseQuantity() {
    return apiClient.get('/api/dashboard/categoryWiseQuantity');
  }

  // Activity feed
  async getDashboardActivities(page = 1, limit = 5) {
    return apiClient.get('/api/dashboard/activities', { params: { page, limit } });
  }

  // Recent transactions list
  async getRecentTransactions() {
    return apiClient.get('/api/dashboard/recentTransactions');
  }

  // Recent sales orders
  async getRecentSalesOrders() {
    return apiClient.get('/api/salesOrder', {
      params: { page: 1, limit: 5, sort: 'createdAt:desc' },
    });
  }

  // Delivery statistics (Pending, Approved, Canceled, Rejected, Completed)
  async getDeliveryStats() {
    return apiClient.get('/api/delivery/stats');
  }
}

export const dashboardService = new DashboardService();
