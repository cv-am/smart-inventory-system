import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Receipt,
  ShoppingCart,
  Boxes,
  ArrowRight,
  Plus,
} from "lucide-react";
import { getDashboardMetrics } from "../../services/billingService";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardMetrics();
        setData(res);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Loader message="Loading dashboard insights..." />;

  const stats = data?.stats || {};
  const recentSales = data?.recentSales || [];
  const lowStockAlerts = data?.lowStockAlerts || [];
  const chartData = data?.chartData || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Business Overview
          </h1>
          <p className="text-xs text-slate-500">
            Real-time sales, inventory valuation, and stock alerts
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link to="/products">
            <Button variant="outline" size="sm" icon={Plus}>
              Add Product
            </Button>
          </Link>
          <Link to="/billing">
            <Button variant="primary" size="sm" icon={Receipt}>
              Create New Bill
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {formatCurrency(stats.totalRevenue)}
            </h3>
            <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-emerald-600">
              Today: {formatCurrency(stats.todayRevenue)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Invoices / Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Invoices Generated
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {stats.totalOrders}
            </h3>
            <span className="mt-1 inline-flex items-center text-[11px] font-semibold text-indigo-600">
              Today: {stats.todayOrders} sales
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Stock Units
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {stats.totalStockUnits}
            </h3>
            <span className="mt-1 text-[11px] font-semibold text-slate-500">
              Across {stats.totalProducts} products
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Low Stock Warnings
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600">
              {stats.lowStockCount}
            </h3>
            <Link
              to="/inventory"
              className="mt-1 text-[11px] font-semibold text-amber-700 hover:underline flex items-center gap-1"
            >
              Review inventory <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Sales Revenue Trend
            </h3>
            <p className="text-xs text-slate-400">
              Daily revenue breakdown for the past 7 days
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            <TrendingUp className="w-4 h-4" /> Past 7 Days
          </div>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="display_date" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Revenue"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total_sales"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No sales data recorded in the last 7 days. Create a bill to visualize trends!
            </div>
          )}
        </div>
      </div>

      {/* Split Section: Recent Transactions & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Invoices
              </h3>
              <p className="text-xs text-slate-400">Latest checkout transactions</p>
            </div>
            <Link
              to="/sales"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70">
                    <td className="py-3 font-semibold text-indigo-600">
                      {sale.invoice_number}
                    </td>
                    <td className="py-3 text-slate-700">{sale.customer_name}</td>
                    <td className="py-3 font-bold text-slate-900">
                      {formatCurrency(sale.total_amount)}
                    </td>
                    <td className="py-3">
                      <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {sale.payment_method}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {formatDate(sale.created_at)}
                    </td>
                  </tr>
                ))}
                {recentSales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No invoices recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Sidebar (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Low Stock Alert
              </h3>
              <p className="text-xs text-slate-400">Items reaching threshold</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>

          <div className="space-y-3">
            {lowStockAlerts.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">
                    SKU: {item.sku}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-rose-600">
                    {item.stock_quantity} left
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Min: {item.low_stock_threshold}
                  </p>
                </div>
              </div>
            ))}

            {lowStockAlerts.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                ✅ All inventory levels are healthy!
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link to="/inventory">
              <Button variant="outline" size="sm" className="w-full">
                Manage Stock Adjustments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

