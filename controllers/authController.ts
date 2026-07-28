import type { NextFunction, Request, Response } from "express";
import { User } from "../models/index.ts";
import ApiError from "../errors/ApiError.ts";
import { comparePassword } from "../utils/password.ts";
import { generateJwt } from "../utils/jwt.ts";

// Публичной регистрации нет намеренно: аккаунты создаёт только ADMIN
// через POST /api/users (там же генерируются email и пароль). Ученики
// и учителя себя сами не регистрируют.

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(ApiError.badRequest("Не переданы email или пароль"));
      }

      const user = await User.findOne({ where: { email } });

      // Намеренно одно и то же сообщение для "нет такого email" и
      // "неверный пароль" — иначе по коду ответа можно перебором
      // выяснять, какие email вообще существуют в системе.
      const invalidCredentials = () =>
        next(ApiError.unauthorized("Неверный email или пароль"));

      if (!user) {
        return invalidCredentials();
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return invalidCredentials();
      }

      const token = generateJwt({
        id: user.id,
        email: user.email,
        role: user.role,
        className: user.className,
      });

      res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    // req.user уже проверен и заполнен authMiddleware к этому моменту
    const token = generateJwt(req.user!);
    res.json({ token, user: req.user });
  }
}

export default new AuthController();
