import type { NextFunction, Request, Response } from "express";
import { TestAccess } from "../models/index.ts";

class TestAccessController {
  //Открыть доступ
  async grantAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId, className } = req.body;

      const access = await TestAccess.findOne({ where: { testId, className } });

      if (access) {
        await access.update({ isOpen: true, openedAt: new Date() });
      } else {
        await TestAccess.create({
          testId,
          className,
          isOpen: true,
          openedAt: new Date(),
        });
      }

      res.json({ message: `Доступ для класса ${className} открыт` });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при открытии доступа;", error });
    }
  }

  //Закрыть доступ
  async revokeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { testId, className } = req.body;

      const access = await TestAccess.findOne({ where: { testId, className } });

      if (access) {
        await access.update({ isOpen: false, closedAt: new Date() });
      }
      res.json({ message: `Доступ для класса ${className} закрыт` });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при закрытии доступа;", error });
    }
  }
}

export default new TestAccessController();
