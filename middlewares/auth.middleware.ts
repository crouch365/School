import type { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError.ts";
import { verifyJwt } from "../utils/jwt.ts";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "OPTIONS") {
    next();
    return;
  }

  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    const token = authHeader?.split(" ")[1];

    if (!token) {
      throw ApiError.unauthorized("Не передан токен авторизации");
    }

    req.user = verifyJwt(token);
    next();
  } catch {
    next(ApiError.unauthorized("Вы не авторизованы"));
  }
};

export default authMiddleware;
