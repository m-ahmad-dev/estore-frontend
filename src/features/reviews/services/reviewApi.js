import api from "../../../services/api";

export const getMyReviews = async ({ cursor, limit = 10, status } = {}) => {
  const params = { limit };
  if (cursor) params.cursor = cursor;
  if (status) params.status = status;

  const response = await api.get("/reviews/me", { params });
  return response.data;
};

export const createReview = async ({ productId, data }) => {
  const response = await api.post(`/products/${productId}/reviews`, data);
  return response.data;
};

export const updateReview = async ({ reviewId, data }) => {
  const response = await api.patch(`/reviews/${reviewId}`, data);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export const getProductReviews = async (productId, params = {}) => {
  const response = await api.get(`/products/${productId}/reviews`, { params });
  return response.data;
};
