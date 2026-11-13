import React, { useRef } from "react";
import { Printer, Download, CheckCircle, Boxes } from "lucide-react";
import Button from "../../components/common/Button";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";

export const InvoiceDetails = ({ invoice, onClose }) => {
  const printRef = useRef(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Area */}
      <div
        ref={printRef}
        className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800 print:border-none print:shadow-none print:p-0"
      >
        {/* Invoice Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                SmartInventory Store
              </h2>
              <p className="text-xs text-slate-400">
                Official Retail Invoice & Receipt
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Invoice Number
            </span>
            <h3 className="text-lg font-black text-indigo-600 font-mono">
              {invoice.invoiceNumber || invoice.invoice_number}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatDate(invoice.createdAt || invoice.created_at)}
            </p>
          </div>
        </div>

        {/* Customer & Payment Meta */}
        <div className="grid grid-cols-2 gap-4 py-6 border-b border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Billed To
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {invoice.customer_name || invoice.customerName || "Walk-in Customer"}
            </p>
            {invoice.customer_phone && (
              <p className="text-slate-500 mt-0.5">Tel: {invoice.customer_phone}</p>
            )}
            {invoice.customer_address && (
              <p className="text-slate-500">{invoice.customer_address}</p>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Payment Details
            </span>
            <p className="font-bold text-slate-900 uppercase">
              Method: {invoice.paymentMethod || invoice.payment_method}
            </p>
            <p className="text-emerald-600 font-semibold mt-0.5 flex items-center justify-end gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Payment Completed
            </p>
            {invoice.billed_by && (
              <p className="text-slate-400 mt-0.5">Cashier: {invoice.billed_by}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 border-b border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3">#</th>
                <th className="pb-3">Item & SKU</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 text-slate-400">{idx + 1}</td>
                  <td className="py-3">
                    <span className="font-bold text-slate-900 block">
                      {item.productName || item.product_name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      SKU: {item.sku}
                    </span>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {formatCurrency(item.unitPrice || item.unit_price)}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary */}
        <div className="pt-4 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax (GST/VAT):</span>
              <span className="font-bold text-slate-900">
                +{formatCurrency(invoice.taxAmount || invoice.tax_amount || 0)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Discount:</span>
              <span className="font-bold text-rose-600">
                -{formatCurrency(invoice.discountAmount || invoice.discount_amount || 0)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-indigo-600 font-mono">
                {formatCurrency(invoice.totalAmount || invoice.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-dashed border-slate-200 text-center text-[10px] text-slate-400">
          Thank you for your business! For queries or returns, please contact store support.
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="flex items-center justify-end gap-3 print:hidden">
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          icon={Printer}
          onClick={handlePrint}
        >
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default InvoiceDetails;

