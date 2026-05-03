import { z } from "zod";

export const paymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.coerce.number().min(1),
  mode: z.enum(["Cash", "UPI", "Online"]),
  paymentDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  verificationPending: z.preprocess((value) => value === true || value === "true", z.boolean()).optional()
});
