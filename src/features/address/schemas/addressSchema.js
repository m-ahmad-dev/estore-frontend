import { z } from "zod";

export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(50, "Label must be 50 characters or less")
    .optional()
    .or(z.literal("")),
  street: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(255, "Street address must be 255 characters or less"),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .max(100, "City must be 100 characters or less"),
  province: z
    .string()
    .trim()
    .min(1, "Province is required")
    .max(100, "Province must be 100 characters or less"),
  province_code: z
    .string()
    .trim()
    .length(2, "Province code must be exactly 2 characters")
    .toUpperCase(),
  country: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country must be 100 characters or less"),
  country_code: z
    .string()
    .trim()
    .min(1, "Country is required")
    .max(2)
    .toUpperCase(),
  postal_code: z
    .string()
    .trim()
    .min(1, "Postal code is required")
    .max(20, "Postal code must be 20 characters or less"),
  is_default: z.boolean().default(false),
});

export const updateAddressSchema = addressSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
