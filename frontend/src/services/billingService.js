import API from "./api";

// Create / Process new invoice
export const createBill = async (billData) => {
  const { data } = await API.post("/billing", billData);
  return data.data;
};

// Sales & Invoices history
export const getSalesHistory = async (params = {}) => {
  const { data } = await API.get("/sales", { params });
  return data.data;
};

export const getSaleInvoice = async (id) => {
  const { data } = await API.get(`/sales/${id}`);
  return data.data;
};

// Dashboard analytics
export const getDashboardMetrics = async () => {
  const { data } = await API.get("/dashboard");
  return data.data;
};

// Inventory management
export const getInventoryItems = async () => {
  const { data } = await API.get("/inventory");
  return data.data;
};

export const getInventorySummary = async () => {
  const { data } = await API.get("/inventory/summary");
  return data.data;
};

export const adjustStock = async (payload) => {
  const { data } = await API.post("/inventory/adjust", payload);
  return data.data;
};

