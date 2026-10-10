import { z } from "zod";

const paymentMethodSchema = z.enum(["CASH_ON_DELIVERY", "CARD"]);

export const authenticatedOrderSchema = z.object({
  address_id: z.string().uuid("Please select a valid address"),
  payment_method: paymentMethodSchema,
});

export const guestOrderSchema = z.object({
  guest_name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(150, "Name is too long"),
  guest_email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(255)
    .transform((v) => v.toLowerCase()),
  guest_phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{1,14}$/, "Enter a valid international phone number"),
  guest_address: z.object({
    country_code: z
      .string()
      .trim()
      .min(1)
      .max(2)
      .transform((v) => v.toUpperCase()),
    province_code: z
      .string()
      .trim()
      .length(2)
      .transform((v) => v.toUpperCase()),
    city: z.string().trim().min(2).max(120),
    street: z.string().trim().min(2).max(500),
    apartment: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().trim().min(2).max(500).optional(),
    ),
    postal_code: z
      .string()
      .trim()
      .regex(/^\d+$/, "Postal code must contain numbers only"),
  }),
  payment_method: paymentMethodSchema,
});

export const orderLookupSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  order_number: z.string().trim().min(1, "Order number is required"),
});
