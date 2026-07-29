import type { NextFunction, Request, Response } from "express";
import { User, TeacherClass, TeacherSubject } from "../models/index.ts";
import { UserRole } from "../models/user/type.ts";
import ApiError from "../errors/ApiError.ts";
import { assertIsSelfOrAdmin } from "../utils/ownership.ts";
import { parseIdParam } from "../utils/parseId.ts";

// Достаём пользователя и убеждаемся, что он действительно учитель —
// иначе можно случайно закрепить класс/предмет за админом или учеником.
const findTeacherOrFail = async (teacherId: number) => {
  const teacher = await User.findByPk(teacherId);
  if (!teacher || teacher.role !== UserRole.TEACHER) {
    throw ApiError.notFound("Учитель не найден");
  }
  return teacher;
};

class TeacherController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      assertIsSelfOrAdmin(user, teacherId);

      const teacher = await findTeacherOrFail(teacherId);
      const [classes, subjects] = await Promise.all([
        TeacherClass.findAll({ where: { teacherId } }),
        TeacherSubject.findAll({ where: { teacherId } }),
      ]);

      res.json({
        id: teacher.id,
        name: teacher.name,
        lastName: teacher.lastName,
        email: teacher.email,
        classes: classes.map((c) => c.className),
        subjects: subjects.map((s) => s.subject),
      });
    } catch (error) {
      next(error);
    }
  }

  // === КЛАССЫ ===

  async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      assertIsSelfOrAdmin(user, teacherId);

      const classes = await TeacherClass.findAll({ where: { teacherId } });
      res.json(classes);
    } catch (error) {
      next(error);
    }
  }

  async assignClass(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      await findTeacherOrFail(teacherId);

      const { className } = req.body;

      // findOrCreate — идемпотентно: повторное закрепление того же класса
      // не упадёт на составном первичном ключе (teacherId, className).
      const [link, created] = await TeacherClass.findOrCreate({
        where: { teacherId, className },
        defaults: { teacherId, className },
      });

      res.status(created ? 201 : 200).json(link);
    } catch (error) {
      next(error);
    }
  }

  async removeClass(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      const { className } = req.params;

      const link = await TeacherClass.findOne({
        where: { teacherId, className },
      });
      if (!link) {
        return next(ApiError.notFound("Такой класс за учителем не закреплён"));
      }

      await link.destroy();
      res.json({ message: `Класс ${className} откреплён от учителя` });
    } catch (error) {
      next(error);
    }
  }

  // === ПРЕДМЕТЫ ===

  async getSubjects(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      assertIsSelfOrAdmin(user, teacherId);

      const subjects = await TeacherSubject.findAll({ where: { teacherId } });
      res.json(subjects);
    } catch (error) {
      next(error);
    }
  }

  async assignSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      await findTeacherOrFail(teacherId);

      const { subject } = req.body;

      const [link, created] = await TeacherSubject.findOrCreate({
        where: { teacherId, subject },
        defaults: { teacherId, subject },
      });

      res.status(created ? 201 : 200).json(link);
    } catch (error) {
      next(error);
    }
  }

  async removeSubject(req: Request, res: Response, next: NextFunction) {
    try {
      const teacherId = parseIdParam(req.params.teacherId, "teacherId");
      const { subject } = req.params;

      const link = await TeacherSubject.findOne({
        where: { teacherId, subject },
      });
      if (!link) {
        return next(
          ApiError.notFound("Такой предмет за учителем не закреплён"),
        );
      }

      await link.destroy();
      res.json({ message: `Предмет "${subject}" откреплён от учителя` });
    } catch (error) {
      next(error);
    }
  }
}

export default new TeacherController();
