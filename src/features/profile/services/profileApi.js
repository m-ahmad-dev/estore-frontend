import api from "../../../services/api";

export const getMyProfile = async () => {
  const response = await api.get("/customers/me");
  return response.data;
};

export const updateMyProfile = async (data) => {
  const response = await api.patch("/customers/me", data);
  return response.data;
};

export const deleteMyAccount = async () => {
  const response = await api.delete("/customers/me");
  return response.data;
};
