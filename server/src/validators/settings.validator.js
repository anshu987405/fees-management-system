import { z } from "zod";

export const settingsSchema = z.object({
  instituteName: z.string().min(2).optional(),
  institutePhone: z.string().optional(),
  instituteEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  upiId: z.string().min(3).optional(),
  publicAppUrl: z.string().url().optional().or(z.literal("")),
  autoWhatsappReminders: z.boolean().optional(),
  reminderOverdueDays: z.coerce.number().min(1).max(365).optional()
});
