import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(150)
      .optional(),
    lastname: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(150)
      .optional(),
    email: z
      .string()
      .trim()
      .email("Enter a valid email")
      .toLowerCase()
      .optional(),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{7,20}$/, "Enter a valid phone number")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
