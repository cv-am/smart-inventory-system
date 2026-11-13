import API from "./api";

export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const getMe = async () => {
  const { data } = await API.get("/auth/me");
  return data;
};

export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    localStorage.removeItem("inventory_token");
    localStorage.removeItem("inventory_user");
  }
};

