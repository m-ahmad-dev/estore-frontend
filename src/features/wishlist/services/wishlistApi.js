import api from "../../../services/api";

export const getWishlist = async ({
  cursor,
  limit = 100,
  sort = "recent",
} = {}) => {
  const params = {
    limit,
    sort,
  };

  if (cursor) {
    params.cursor = cursor;
  }

  const response = await api.get("/wishlist", {
    params,
  });

  return response.data;
};

export const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", {
    product_id: productId,
  });

  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await api.delete(`/wishlist/${wishlistId}`);

  return response.data;
};
