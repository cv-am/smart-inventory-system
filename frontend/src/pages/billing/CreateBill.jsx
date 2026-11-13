import React, { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  CreditCard,
  Banknote,
  QrCode,
  AlertCircle,
  Package,
} from "lucide-react";
import * as productService from "../../services/productService";
import * as customerService from "../../services/customerService";
import * as billingService from "../../services/billingService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import InvoiceDetails from "./InvoiceDetails";
import { formatCurrency } from "../../utils/formatCurrency";
import toast from "react-hot-toast";

export const CreateBill = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [taxAmount, setTaxAmount] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Success Modal
  const [completedInvoice, setCompletedInvoice] = useState(null);

  const loadData = async () => {
    try {
      const [prodData, custData] = await Promise.all([
        productService.getProducts(),
        customerService.getCustomers(),
      ]);
      setProducts(prodData);
      setCustomers(custData);
    } catch {
      toast.error("Failed to load catalog or customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addToCart = (product) => {
    if (product.stock_quantity <= 0) {
      return toast.error("Product is out of stock!");
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.error(`Only ${product.stock_quantity} units available in stock!`);
          return prev;
        }
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          price: Number(product.price),
          stockQuantity: product.stock_quantity,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            if (newQty > item.stockQuantity) {
              toast.error(`Max stock available is ${item.stockQuantity}`);
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Number(taxAmount) || 0;
  const discount = Number(discountAmount) || 0;
  const grandTotal = Math.max(0, subtotal + tax - discount);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return toast.error("Cart is empty! Add products to create a bill.");
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        customerId: selectedCustomerId ? Number(selectedCustomerId) : null,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        taxAmount: tax,
        discountAmount: discount,
        paymentMethod,
      };

      const result = await billingService.createBill(payload);
      toast.success(`Invoice ${result.invoiceNumber} generated!`);

      // Find customer name for display
      const custObj = customers.find(
        (c) => c.id === Number(selectedCustomerId)
      );
      setCompletedInvoice({
        ...result,
        customer_name: custObj ? custObj.name : "Walk-in Customer",
        customer_phone: custObj ? custObj.phone : null,
      });

      // Clear cart
      setCart([]);
      setTaxAmount("0");
      setDiscountAmount("0");
      loadData(); // Refresh product stock levels
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader message="Loading POS terminal..." />;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Billing & Point of Sale (POS)
        </h1>
        <p className="text-xs text-slate-500">
          Create customer bills, apply discounts/taxes, and automatically deduct warehouse stock
        </p>
      </div>

      {/* Main Grid: Left = Product Browser (7 cols), Right = Cart & Checkout (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <Input
              icon={Search}
              placeholder="Search product name or scan SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => {
              const inStock = p.stock_quantity > 0;
              const cartItem = cart.find((i) => i.productId === p.id);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                    inStock
                      ? "bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50/50"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {p.sku}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {p.category_name}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-base font-black text-slate-900 block">
                        {formatCurrency(p.price)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          inStock ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {inStock ? `${p.stock_quantity} in stock` : "Out of stock"}
                      </span>
                    </div>

                    <Button
                      variant={cartItem ? "secondary" : "primary"}
                      size="sm"
                      disabled={!inStock}
                      onClick={() => addToCart(p)}
                    >
                      {cartItem ? `In Cart (${cartItem.quantity})` : "Add"}
                    </Button>
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="col-span-2 py-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                No matching products found in catalog.
              </div>
            )}
          </div>
        </div>

        {/* Right: Cart and Billing Calculation */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Current Cart</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          {/* Customer Selection */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Customer (Optional)
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full text-xs font-medium rounded-lg border border-slate-300 py-2.5 px-3 bg-white outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
            >
              <option value="">Walk-in Customer (General)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="pt-2 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {formatCurrency(item.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded-l"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="p-1 hover:bg-slate-100 text-slate-500 rounded-r"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="w-16 text-right font-bold text-slate-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                Cart is empty. Select products from the left to begin billing.
              </div>
            )}
          </div>

          {/* Tax and Discount Controls */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">
            <Input
              label="Tax Amount (₹)"
              type="number"
              min="0"
              value={taxAmount}
              onChange={(e) => setTaxAmount(e.target.value)}
            />
            <Input
              label="Discount (₹)"
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "cash", label: "Cash", icon: Banknote },
                { id: "upi", label: "UPI", icon: QrCode },
                { id: "card", label: "Card", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bill Totals Summary */}
          <div className="p-4 bg-slate-50/80 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(subtotal)}
              </span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Tax:</span>
                <span className="font-semibold text-slate-800">
                  +{formatCurrency(tax)}
                </span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Discount:</span>
                <span className="font-semibold text-rose-600">
                  -{formatCurrency(discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900">
              <span>Grand Total:</span>
              <span className="text-indigo-600 font-mono">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full py-3.5 text-sm font-bold shadow-md shadow-indigo-100"
            disabled={cart.length === 0}
            isLoading={checkoutLoading}
            onClick={handleCheckout}
          >
            Process & Generate Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Modal on Success */}
      <Modal
        isOpen={Boolean(completedInvoice)}
        onClose={() => setCompletedInvoice(null)}
        title="Sale Completed Successfully"
        subtitle="The invoice has been recorded in your database and stock deducted."
        maxWidth="max-w-2xl"
      >
        <InvoiceDetails
          invoice={completedInvoice}
          onClose={() => setCompletedInvoice(null)}
        />
      </Modal>
    </div>
  );
};

export default CreateBill;

