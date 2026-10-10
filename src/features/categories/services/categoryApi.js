import api from "../../../services/api";

export const getRootCategories = async () => {
  const response = await api.get("/categories/roots");

  return response.data;
};

export const getCategoryDetails = async (slug) => {
  const response = await api.get(`/categories/${slug}/details`);

  return response.data;
};
