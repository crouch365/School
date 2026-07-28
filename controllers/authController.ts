import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/index.ts";
import ApiError from "../errors/ApiError.ts";

class AuthController {
  // нужно добавит везде регистрацию тоже, так как иначе токен никак на засунуть  токен jwt в env
  //   async registration(req: Request, res: Response, next: NextFunction) {
  //     const { email, password, role } = req.body;
  //     if (!email || !password) {
  //       return next(ApiError.badRequest("Некорректный email или password"));
  //     }
  //     const candidate = await User.findOne({ where: { email } });
  //     if (candidate) {
  //       return next(
  //         ApiError.badRequest("Пользователь с таким email уже существует"),
  //       );
  //     }
  //     const hashPassword = await bcrypt.hash(password, 5);
  //     const user = await User.create({ email, role, password: hashPassword });
  //     const token = generateJwt(user.id, user.email, user.role);
  //     return res.json({ token });
  //   }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: email });
      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }

      let isPasswordValidate = await bcrypt.compare(password, user.password);
      if (!isPasswordValidate) {
        return next(ApiError.internal("Указан неверный пароль"));
      }
      //   const token = generateJwt(user.id, user.email, user.role);
      //   return res.json({ token });
    } catch (error) {
      console.error("AuthController.login error:", error);
      res.status(500).json({ message: "Ошибка сервера при авторизации" });
    }
  }
}
