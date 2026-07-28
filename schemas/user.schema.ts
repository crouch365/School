// schemas/user.schema.ts
import { z } from "zod";
import { UserRole } from "../models/user/type.ts";

const roleEnum = z.enum([UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT]);

export const createUserSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  role: roleEnum,
  className: z.string().min(1).optional().nullable(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  role: roleEnum.optional(),
  className: z.string().min(1).optional().nullable(),
});
