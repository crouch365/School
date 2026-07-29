import { z } from "zod";

export const assignClassSchema = z.object({
  className: z.string().min(1, "className обязателен"),
});

export const assignSubjectSchema = z.object({
  subject: z.string().min(1, "subject обязателен"),
});
