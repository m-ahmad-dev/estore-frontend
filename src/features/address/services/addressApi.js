import api from "../../../services/api";

export const getAddresses = async () => {
  const response = await api.get("/addresses");

  return response.data;
};

export const getAddress = async (addressId) => {
  const response = await api.get(`/addresses/${addressId}`);

  return response.data;
};

export const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);

  return response.data;
};

export const updateAddress = async ({ addressId, data }) => {
  const response = await api.patch(`/addresses/${addressId}`, data);

  return response.data;
};

export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/addresses/${addressId}`);

  return response.data;
};
