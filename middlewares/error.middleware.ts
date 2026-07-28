import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import {
  ValidationError as SequelizeValidationError,
  UniqueConstraintError,
} from "sequelize";
import ApiError from "../errors/ApiError.ts";

// Единственное место в приложении, где ошибка превращается в HTTP-ответ.
// Обязательно должно быть последним app.use() в index.ts (после notFoundMiddleware).
const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  // Ожидаемые, "наши" ошибки — ApiError.badRequest/notFound/forbidden/...
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  // Ошибки валидации от zod
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Некорректные данные запроса",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Нарушение уникального индекса (например, email уже занят)
  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      message: "Запись с такими данными уже существует",
      fields: Object.keys(err.fields ?? {}),
    });
    return;
  }

  // Прочие ошибки валидации модели Sequelize
  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      message: "Некорректные данные",
      errors: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
    return;
  }

  console.error("Необработанная ошибка:", err);
  res.status(500).json({ message: "Непредвиденная ошибка сервера" });
};

export default errorMiddleware;
