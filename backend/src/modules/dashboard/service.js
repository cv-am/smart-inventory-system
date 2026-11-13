import {
  selectDashboardStats,
  selectRecentSales,
  selectSalesChartData,
} from "./query.js";
import { selectLowStockProducts } from "../products/query.js";

// Service: Aggregate full dashboard payload
export const getDashboardDataService = async () => {
  const [stats, recentSales, chartData, lowStockItems] = await Promise.all([
    selectDashboardStats(),
    selectRecentSales(5),
    selectSalesChartData(),
    selectLowStockProducts(),
  ]);

  return {
    stats: {
      totalProducts: Number(stats.total_products) || 0,
      totalCategories: Number(stats.total_categories) || 0,
      totalCustomers: Number(stats.total_customers) || 0,
      totalOrders: Number(stats.total_orders) || 0,
      totalRevenue: Number(stats.total_revenue) || 0,
      todayRevenue: Number(stats.today_revenue) || 0,
      todayOrders: Number(stats.today_orders) || 0,
      totalStockUnits: Number(stats.total_stock_units) || 0,
      lowStockCount: Number(stats.low_stock_count) || 0,
    },
    recentSales,
    chartData,
    lowStockAlerts: lowStockItems.slice(0, 5),
  };
};

