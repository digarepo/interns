import { z } from "zod";

export const shareholderSchema = z.object({
  fn_id: z
    .string()
    .trim()
    .min(1, { message: "ID is required" })
    .max(20, { message: "ID must be at most 20 characters" }),
  full_name: z
    .string()
    .trim()
    .min(1, { message: "Full name is required" })
    .max(100, { message: "Full name must be at most 100 characters" }),
});

export type Shareholder = z.infer<typeof shareholderSchema>;
