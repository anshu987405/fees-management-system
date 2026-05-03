import { z } from "zod";

export const studentSchema = z.object({
  fullName: z.string().min(2),
  fatherName: z.string().min(2),
  phone: z.string().regex(/^[0-9+\-\s]{10,16}$/, "Invalid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  courseName: z.string().min(2),
  totalFees: z.coerce.number().min(0),
  paidFees: z.coerce.number().min(0).default(0),
  admissionDate: z.coerce.date(),
  notes: z.string().optional()
});

export const studentUpdateSchema = studentSchema.partial();
