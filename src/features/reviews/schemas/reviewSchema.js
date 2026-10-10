import { z } from "zod";

export const createReviewSchema = z.object({
  order_id: z.string().uuid("Invalid order ID"),
  rating: z.number().int().min(1).max(5),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(120)
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .max(2000, "Comment cannot exceed 2000 characters")
    .optional()
    .or(z.literal("")),
});

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().trim().min(2).max(120).optional().or(z.literal("")),
    comment: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });
