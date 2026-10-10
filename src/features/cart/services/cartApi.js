import api from "../../../services/api";

export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

export const addCartItem = async ({ variant_id, quantity = 1 }) => {
  const response = await api.post("/cart/items", {
    variant_id,
    quantity,
  });

  return response.data;
};

export const updateCartItem = async ({
  itemId,
  action,
  quantity = 1,
}) => {
  const response = await api.patch(`/cart/items/${itemId}`, {
    action,
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);

  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart");

  return response.data;
};

export const applyCoupon = async (code) => {
  const response = await api.patch("/cart/coupon", {
    code,
  });

  return response.data;
};

export const removeCoupon = async () => {
  const response = await api.delete("/cart/coupon");

  return response.data;
};