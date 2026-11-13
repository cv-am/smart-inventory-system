import API from "./api";

export const getCategories = async () => {
  const { data } = await API.get("/categories");
  return data.data;
};

export const createCategory = async (payload) => {
  const { data } = await API.post("/categories", payload);
  return data;
};

export const updateCategory = async (id, payload) => {
  const { data } = await API.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await API.delete(`/categories/${id}`);
  return data;
};

