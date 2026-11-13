import React, { useEffect, useState } from "react";
import {
  Boxes,
  AlertTriangle,
  ArrowUpDown,
  Plus,
  Minus,
  RefreshCw,
  Search,
} from "lucide-react";
import * as billingService from "../../services/billingService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const Inventory = () => {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Adjustment Modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState("add"); // add, subtract, set
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustLoading, setAdjustLoading] = useState(false);

  const loadInventory = async () => {
    try {
      const [inventoryData, summaryData] = await Promise.all([
        billingService.getInventoryItems(),
        billingService.getInventorySummary(),
      ]);
      setItems(inventoryData);
      setSummary(summaryData);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleOpenAdjust = (product) => {
    setSelectedProduct(product);
    setAdjustType("add");
    setAdjustQty("10");
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustQty || isNaN(adjustQty) || Number(adjustQty) <= 0) {
      return toast.error("Please enter a valid positive quantity");
    }

    setAdjustLoading(true);
    try {
      await billingService.adjustStock({
        productId: selectedProduct.id,
        type: adjustType,
        quantity: Number(adjustQty),
      });
      toast.success(
        `Stock updated for ${selectedProduct.name} (${adjustType.toUpperCase()} ${adjustQty})`
      );
      setAdjustModalOpen(false);
      loadInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to adjust stock");
    } finally {
      setAdjustLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500">
            Monitor stock levels, warehouse valuation, and record supplier replenishments
          </p>
        </div>
      </div>

      {/* Summary KPI Badges */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Warehouse Valuation
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900">
              {formatCurrency(summary.total_inventory_valuation)}
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Units on Shelf
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-indigo-600">
              {summary.total_units} units
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Low Stock Items
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-amber-600">
              {summary.low_stock_count} items
            </h3>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Out of Stock
            </span>
            <h3 className="mt-1 text-2xl font-extrabold text-rose-600">
              {summary.out_of_stock_count} items
            </h3>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="max-w-md w-full">
          <Input
            icon={Search}
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "in_stock", "low_stock", "out_of_stock"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <Loader message="Loading stock inventory..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Inventory Records"
          description="Add products to your catalog to begin tracking stock units."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200/70 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Product & SKU</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Unit Price</th>
                <th className="px-6 py-3.5">Quantity on Hand</th>
                <th className="px-6 py-3.5">Stock Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      SKU: {item.sku}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {item.category_name || "—"}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900 text-base">
                      {item.stock_quantity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Min warning: {item.low_stock_threshold}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {item.status === "out_of_stock" ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        Out of Stock
                      </span>
                    ) : item.status === "low_stock" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowUpDown}
                      onClick={() => handleOpenAdjust(item)}
                    >
                      Adjust Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        title="Adjust Stock Quantity"
        subtitle={
          selectedProduct
            ? `Updating inventory for: ${selectedProduct.name} (Current: ${selectedProduct.stock_quantity})`
            : ""
        }
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Adjustment Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAdjustType("add")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  adjustType === "add"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Restock (+)
              </button>
              <button
                type="button"
                onClick={() => setAdjustType("subtract")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  adjustType === "subtract"
                    ? "bg-rose-50 border-rose-500 text-rose-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Minus className="w-3.5 h-3.5" /> Damage (-)
              </button>
              <button
                type="button"
                onClick={() => setAdjustType("set")}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  adjustType === "set"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Set Exact (=)
              </button>
            </div>
          </div>

          <Input
            label={
              adjustType === "set"
                ? "Exact New Stock Count"
                : `Quantity to ${adjustType}`
            }
            name="quantity"
            type="number"
            placeholder="e.g. 25"
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
            required
          />

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 flex justify-between">
            <span>Resulting Stock Level:</span>
            <span className="font-bold text-slate-900">
              {adjustType === "add"
                ? (selectedProduct?.stock_quantity || 0) + (Number(adjustQty) || 0)
                : adjustType === "subtract"
                ? Math.max(
                    0,
                    (selectedProduct?.stock_quantity || 0) - (Number(adjustQty) || 0)
                  )
                : Number(adjustQty) || 0}
            </span>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdjustModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={adjustLoading}
            >
              Apply Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;

