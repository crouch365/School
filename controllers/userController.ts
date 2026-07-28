import type { NextFunction, Request, Response } from "express";
import { User } from "../models/index.ts";
import { UserRole } from "../models/user/type.ts";
import ApiError from "../errors/ApiError.ts";
import { hashPassword } from "../utils/password.ts";
import {
  generatePassword,
  generateUniqueEmail,
} from "../utils/generateCredentials.ts";
import { parseIdParam } from "../utils/parseId.ts";

const SAFE_ATTRIBUTES = { exclude: ["password"] };

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 20);

      const { rows, count } = await User.findAndCountAll({
        attributes: SAFE_ATTRIBUTES,
        limit,
        offset: (page - 1) * limit,
      });

      res.json({ items: rows, total: count, page, limit });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(parseIdParam(req.params.id), {
        attributes: SAFE_ATTRIBUTES,
      });
      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, lastName, role, className } = req.body;

      if (!name || !lastName || !role) {
        return next(ApiError.badRequest("Не переданы name, lastName или role"));
      }
      if (!Object.values(UserRole).includes(role)) {
        return next(ApiError.badRequest("Некорректная роль"));
      }

      const email = await generateUniqueEmail(name, lastName);
      const plainPassword = generatePassword();
      const hashedPassword = await hashPassword(plainPassword);

      const user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword,
        role,
        className: role === UserRole.STUDENT ? className : null,
      });

      // Пароль в открытом виде отдаём только один раз, прямо сейчас —
      // больше его нигде не будет, ни в БД, ни в последующих ответах.
      res.status(201).json({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        plainPassword,
        role: user.role,
        className: user.className,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(parseIdParam(req.params.id));
      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      const { name, lastName, role, className } = req.body;
      await user.update({
        name,
        lastName,
        role,
        className: role === UserRole.STUDENT ? className : null,
      });

      const { password, ...safeUser } = user.get({ plain: true });
      res.json(safeUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(parseIdParam(req.params.id));
      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      await user.destroy();
      res.json({ message: "Пользователь успешно удалён" });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
