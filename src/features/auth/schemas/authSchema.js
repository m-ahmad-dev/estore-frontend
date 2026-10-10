import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .min(2, "First name must be at least 2 characters.")
    .max(150, "First name must not exceed 150 characters."),

  lastname: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .min(2, "Last name must be at least 2 characters.")
    .max(150, "Last name must not exceed 150 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must not exceed 128 characters."),

  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^\d{7,20}$/.test(val), {
      message:
        "Phone number must contain only digits and be between 7 and 20 characters.",
    })
    .transform((val) => (val === "" || val == null ? undefined : val)),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address.")
    .transform((val) => val.toLowerCase()),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    newPassword: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(128, "Password must not exceed 128 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
