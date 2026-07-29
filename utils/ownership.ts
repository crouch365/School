import ApiError from "../errors/ApiError.ts";
import { TeacherClass, TeacherSubject } from "../models/index.ts";
import type { Test } from "../models/test/Test.model.ts";
import { UserRole } from "../models/user/type.ts";
import type { JwtPayload } from "./jwt.ts";

// Тест принадлежит учителю. Админ может всё.
export const assertOwnsTest = (user: JwtPayload, test: Test) => {
  if (user.role === UserRole.ADMIN) return;
  if (user.role === UserRole.TEACHER && test.teacherId === user.id) return;
  throw ApiError.forbidden("Это не ваш тест");
};

// Учитель ведёт этот предмет. Админ может всё.
export const assertTeachesSubject = async (
  user: JwtPayload,
  subject: string,
) => {
  if (user.role === UserRole.ADMIN) return;
  const link = await TeacherSubject.findOne({
    where: { teacherId: user.id, subject },
  });
  if (!link) {
    throw ApiError.forbidden(`Вы не ведёте предмет "${subject}"`);
  }
};

// Учитель ведёт этот класс. Админ может всё.
export const assertTeachesClass = async (
  user: JwtPayload,
  className: string,
) => {
  if (user.role === UserRole.ADMIN) return;
  const link = await TeacherClass.findOne({
    where: { teacherId: user.id, className },
  });
  if (!link) {
    throw ApiError.forbidden(`Вы не ведёте класс "${className}"`);
  }
};

// Пользователь смотрит свои же данные, либо он админ.
export const assertIsSelfOrAdmin = (user: JwtPayload, targetUserId: number) => {
  if (user.role === UserRole.ADMIN) return;
  if (user.id === targetUserId) return;
  throw ApiError.forbidden("Доступ только к своим данным");
};
