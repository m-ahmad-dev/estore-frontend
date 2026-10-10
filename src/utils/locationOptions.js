import { State } from "country-state-city";

export const getProvincesForCountry = (countryCode) => {
  if (!countryCode) return [];

  return State.getStatesOfCountry(countryCode.toUpperCase())
    .map((state) => ({
      name: state.name,
      code: state.isoCode?.toUpperCase(),
    }))
    .filter((state) => state.name && state.code);
};

export const getValidProvincesForCountry = (countryCode) => {
  return getProvincesForCountry(countryCode).filter(
    (province) => province.code.length === 2,
  );
};
