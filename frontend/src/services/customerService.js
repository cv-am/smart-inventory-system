import API from "./api";

export const getCustomers = async (search = "") => {
  const { data } = await API.get("/customers", { params: { search } });
  return data.data;
};

export const getCustomerById = async (id) => {
  const { data } = await API.get(`/customers/${id}`);
  return data.data;
};

export const createCustomer = async (payload) => {
  const { data } = await API.post("/customers", payload);
  return data.data;
};

export const updateCustomer = async (id, payload) => {
  const { data } = await API.put(`/customers/${id}`, payload);
  return data.data;
};

export const deleteCustomer = async (id) => {
  const { data } = await API.delete(`/customers/${id}`);
  return data;
};

