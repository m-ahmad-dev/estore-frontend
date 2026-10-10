// src/features/orders/services/orderApi.js
import api from "../../../services/api";

export const createOrder = async (payload) => {
  const response = await api.post("/orders", payload);
  return response.data;
};

export const getCustomerOrders = async ({
  status,
  limit = 15,
  cursor,
} = {}) => {
  const params = { limit };
  if (status) params.status = status;
  if (cursor) params.cursor = cursor;

  const response = await api.get("/orders", { params });
  return response.data;
};

export const getCustomerOrder = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async ({ orderId, email }) => {
  const response = await api.patch(
    `/orders/${orderId}/cancel`,
    email ? { email } : {},
  );
  return response.data;
};

export const lookupOrder = async ({ email, order_number }) => {
  const response = await api.get("/orders/lookup", {
    params: { email, order_number },
  });
  return response.data;
};


export const createOrderPaymentSession = async (input) => {
  const { orderId, ...identity } = typeof input === "string" ? { orderId: input } : input;
  const response = await api.post(`/orders/${orderId}/payment-session`, identity);
  return response.data;
};
