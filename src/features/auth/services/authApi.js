import api from "../../../services/api";

export const loginCustomer = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const registerCustomer = async (customerData) => {
  const response = await api.post("/auth/register", customerData);

  return response.data;
};

export const getCurrentCustomer = async () => {
  const response = await api.get("/customers/me");

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await api.post("/refresh-token");

  return response.data;
};

export const logoutCustomer = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post("/auth/reset-password", data);

  return response.data;
};

export const updateCurrentCustomer = async (data) => {
  const response = await api.patch("/customers/me", data);
  return response.data;
};

export const deleteCurrentCustomer = async () => {
  const response = await api.delete("/customers/me");
  return response.data;
};
