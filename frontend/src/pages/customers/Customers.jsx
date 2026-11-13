import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import * as customerService from "../../services/customerService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Purchase History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getCustomers(search);
      setCustomers(data);
    } catch {
      toast.error("Failed to load customer list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({ name: "", phone: "", email: "", address: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name,
      phone: c.phone || "",
      email: c.email || "",
      address: c.address || "",
    });
    setModalOpen(true);
  };

  const handleViewHistory = async (c) => {
    setHistoryLoading(true);
    setHistoryModalOpen(true);
    try {
      const details = await customerService.getCustomerById(c.id);
      setSelectedCustomer(details);
    } catch {
      toast.error("Failed to load customer purchase history");
      setHistoryModalOpen(false);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return toast.error("Customer name is required");
    }

    setSubmitLoading(true);
    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData);
        toast.success("Customer updated successfully");
      } else {
        await customerService.createCustomer(formData);
        toast.success("Customer registered successfully");
      }
      setModalOpen(false);
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save customer");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await customerService.deleteCustomer(deleteId);
      toast.success("Customer deleted");
      setDeleteId(null);
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete customer");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-slate-500">
            Maintain customer records, contact info, and lifetime purchase history
          </p>
        </div>
        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add Customer
        </Button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="w-full max-w-sm">
          <Input
            icon={Search}
            placeholder="Search by customer name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Total: {customers.length} registered customers
        </span>
      </div>

      {/* Customers Table */}
      {loading ? (
        <Loader message="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Customers Found"
          description="Register customers during checkout to track their purchase history."
          actionLabel="Add Customer"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/60 border-b border-slate-200/70 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Customer Name</th>
                <th className="px-6 py-3.5">Contact Details</th>
                <th className="px-6 py-3.5">Total Invoices</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 space-y-0.5">
                    {c.phone && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {c.phone}
                      </div>
                    )}
                    {c.email && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                        {c.email}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
                      {c.total_orders} Orders
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600 text-sm">
                    {formatCurrency(c.total_spent)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleViewHistory(c)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Purchase History"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Customer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Register New Customer"}
        subtitle="Customer details help personalize invoices and maintain purchase logs."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Name"
            name="name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />

            <Input
              label="Email (Optional)"
              name="email"
              type="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Address (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Street address, city, state..."
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="block w-full rounded-lg border border-slate-300 bg-white text-slate-900 text-sm p-3 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 placeholder-slate-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={submitLoading}
            >
              {editingCustomer ? "Save Changes" : "Register Customer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Customer Purchase History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={selectedCustomer ? `${selectedCustomer.name}'s History` : "History"}
        subtitle="Complete record of bills and transactions generated for this customer."
        maxWidth="max-w-2xl"
      >
        {historyLoading ? (
          <Loader message="Loading invoices..." />
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex justify-between text-xs">
              <div>
                <p className="text-slate-500 font-medium">Contact:</p>
                <p className="font-bold text-slate-800">
                  {selectedCustomer?.phone || "No Phone"} • {selectedCustomer?.email || "No Email"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-medium">Total Orders:</p>
                <p className="font-bold text-indigo-700">
                  {selectedCustomer?.bills?.length || 0} Bills
                </p>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
              {selectedCustomer?.bills?.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 block">
                      {b.invoice_number}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(b.created_at)} • Method: {b.payment_method.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block text-sm">
                      {formatCurrency(b.total_amount)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Subtotal: {formatCurrency(b.subtotal)}
                    </span>
                  </div>
                </div>
              ))}

              {(!selectedCustomer?.bills || selectedCustomer.bills.length === 0) && (
                <p className="py-6 text-center text-slate-400">
                  No purchases recorded for this customer yet.
                </p>
              )}
            </div>

            <div className="pt-2 text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHistoryModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to remove this customer? Past bills will retain transaction history but dissociate customer details."
        confirmLabel="Delete Customer"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default Customers;

