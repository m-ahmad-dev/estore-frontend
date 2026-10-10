import api from "../../../services/api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${encodeURIComponent(slug)}`);

  return response.data;
};
