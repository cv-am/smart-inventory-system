import React, { useEffect, useState } from "react";
import {
  History,
  Search,
  Calendar,
  Eye,
  Printer,
  CreditCard,
  FileText,
} from "lucide-react";
import * as billingService from "../../services/billingService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import InvoiceDetails from "../billing/InvoiceDetails";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Invoice Details Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const fetchSales = async () => {
    try {
      const data = await billingService.getSalesHistory({
        search: search || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      setSales(data);
    } catch {
      toast.error("Failed to load sales transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [fromDate, toDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSales();
  };

  const handleViewInvoice = async (id) => {
    setInvoiceLoading(true);
    try {
      const invoiceData = await billingService.getSaleInvoice(id);
      setSelectedInvoice(invoiceData);
    } catch {
      toast.error("Failed to load invoice details");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const totalSalesRevenue = sales.reduce(
    (sum, s) => sum + Number(s.total_amount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sales & Invoice Archive
          </h1>
          <p className="text-xs text-slate-500">
            Audit past invoices, customer transactions, and reprint receipts
          </p>
        </div>

        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-right">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Filtered Total Revenue
          </span>
          <span className="text-lg font-black text-indigo-600 font-mono">
            {formatCurrency(totalSalesRevenue)}
          </span>
        </div>
      </div>

      {/* Filter and Date Range Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <Input
            icon={Search}
            placeholder="Search invoice number or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="md">
            Filter
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-indigo-600"
            />
          </div>

          {(fromDate || toDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Sales Table */}
      {loading ? (
        <Loader message="Loading sales history..." />
      ) : sales.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Sales Invoices Found"
          description="Invoices will appear here as soon as transactions are processed at the POS."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200/70 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Billed By</th>
                <th className="px-6 py-3.5">Items</th>
                <th className="px-6 py-3.5">Method</th>
                <th className="px-6 py-3.5">Total Amount</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-indigo-600 font-mono">
                    {s.invoice_number}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {s.customer_name}
                    {s.customer_phone && (
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {s.customer_phone}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {s.billed_by || "System"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {s.total_units_sold} units
                    <span className="text-[10px] text-slate-400 block">
                      ({s.total_items} items)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {s.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900 text-sm">
                    {formatCurrency(s.total_amount)}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleViewInvoice(s.id)}
                    >
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Invoice Details & Print Modal */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Details"
        subtitle="Official transaction receipt"
        maxWidth="max-w-2xl"
      >
        <InvoiceDetails
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      </Modal>
    </div>
  );
};

export default SalesHistory;

