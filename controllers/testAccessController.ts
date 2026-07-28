import type { NextFunction, Request, Response } from "express";
import { Test, TestAccess } from "../models/index.ts";
import ApiError from "../errors/ApiError.ts";
import { assertOwnsTest, assertTeachesClass } from "../utils/ownership.ts";

class TestAccessController {
  async grantAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { testId, className } = req.body;
      if (!testId || !className) {
        return next(ApiError.badRequest("Не переданы testId или className"));
      }

      const test = await Test.findByPk(testId);
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);
      await assertTeachesClass(user, className);

      // findOrCreate атомарен на уровне БД — при параллельных запросах
      // (например, двойной клик "открыть доступ") не даёт создать
      // две записи и упасть на уникальном индексе (testId, className).
      const [access] = await TestAccess.findOrCreate({
        where: { testId, className },
        defaults: { testId, className, isOpen: true, openedAt: new Date() },
      });

      if (!access.isOpen) {
        await access.update({ isOpen: true, openedAt: new Date() });
      }

      res.json({ message: `Доступ для класса ${className} открыт` });
    } catch (error) {
      next(error);
    }
  }

  async revokeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { testId, className } = req.body;
      if (!testId || !className) {
        return next(ApiError.badRequest("Не переданы testId или className"));
      }

      const test = await Test.findByPk(testId);
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      const access = await TestAccess.findOne({ where: { testId, className } });
      if (access) {
        await access.update({ isOpen: false, closedAt: new Date() });
      }
      res.json({ message: `Доступ для класса ${className} закрыт` });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestAccessController();
