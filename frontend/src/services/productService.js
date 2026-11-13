import API from "./api";

export const getProducts = async (params = {}) => {
  const { data } = await API.get("/products", { params });
  return data.data;
};

export const getProductById = async (id) => {
  const { data } = await API.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (payload) => {
  const { data } = await API.post("/products", payload);
  return data.data;
};

export const updateProduct = async (id, payload) => {
  const { data } = await API.put(`/products/${id}`, payload);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

export const getLowStockAlerts = async () => {
  const { data } = await API.get("/products/alerts/low-stock");
  return data.data;
};

