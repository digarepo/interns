import { z } from "zod";

export const ShareholderSchema = z.object({
  fn_id: z
    .string()
    .min(3, "ID is required")
    .max(20, "ID must be 50 characters or less")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "ID can only contain letters, numbers, hyphens, and underscores"
    ),

  full_name: z
    .string()
    .min(3, "Full name is required")
    .max(50, "Full name must be 100 characters or less")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Full name can only contain letters, spaces, hyphens, and apostrophes"
    ),
});

export type ShareholderFormData = z.infer<typeof ShareholderSchema>;
