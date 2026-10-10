import api from "../../../services/api";

export const getCountries = async () => {
  const response = await api.get("/countries");

  return response.data;
};
