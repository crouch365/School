import { z } from "zod";

export const createTestSchema = z.object({
  subject: z.string().min(1, "subject обязателен"),
  title: z.string().min(1, "title обязателен"),
  description: z.string().optional().nullable(),
  timeLimit: z.number().int().positive("timeLimit должен быть > 0"),
  teacherId: z.number().int().positive().optional(), // только для ADMIN
});

export const updateTestSchema = z.object({
  subject: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  timeLimit: z.number().int().positive().optional(),
});

export const questionSchema = z
  .object({
    text: z.string().min(1, "text обязателен"),
    options: z.array(z.string().min(1)).min(2, "Минимум 2 варианта ответа"),
    correctOptionIndex: z.number().int().min(0),
  })
  .refine((data) => data.correctOptionIndex < data.options.length, {
    message: "correctOptionIndex вне границ options",
    path: ["correctOptionIndex"],
  });

export const grantAccessSchema = z.object({
  testId: z.number().int().positive(),
  className: z.string().min(1),
});

export const revokeAccessSchema = grantAccessSchema;

export const submitAttemptSchema = z.object({
  testId: z.number().int().positive(),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        optionIndex: z.number().int().min(0),
      }),
    )
    .min(1),
});
