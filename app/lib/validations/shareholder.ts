import { z } from "zod";

export const shareholderSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email"),
});

export type Shareholder = z.infer<typeof shareholderSchema>;
