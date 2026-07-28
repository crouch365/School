import bcrypt from "bcrypt";
import { UserRole } from "../models/user/type.js";
import { User } from "../models/user/User.model.js";
import type { NextFunction, Request, Response } from "express";

const generatePassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const transliterate = (str: string) => {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ы: "y",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return str
    .toLowerCase()
    .split("")
    .map((char) => map[char] || char)
    .join("");
};

const generateEmail = (name: string, lastName: string) => {
  const first = transliterate(name);
  const last = transliterate(lastName);
  return `${first}.${last}${Math.floor(Math.random() * 1000)}@school.local`;
};

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении пользователей" });
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, lastName, role, className } = req.body;

      const email = generateEmail(name, lastName);
      const plainPassword = generatePassword(8);
      const hashedPassword = await bcrypt.hash(plainPassword, 5);

      const user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword,
        role,
        className: role === UserRole.STUDENT ? className : null,
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        plainPassword, // Отдаем только при создании!
        role: user.role,
        className: user.className,
      });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при создании пользователя" });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });

      const { name, lastName, role, className } = req.body;
      await user.update({
        name,
        lastName,
        role,
        className: role === UserRole.STUDENT ? className : null,
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении пользователя" });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Пользователь не найден" });

      await user.destroy();
      res.json({ message: "Пользователь успешно удален" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении пользователя" });
    }
  }
}

export default new UserController();
