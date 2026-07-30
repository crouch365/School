import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

// Берём X-Request-Id от реверс-прокси/балансировщика, если он его
// проставляет, иначе генерируем свой. Кладём в res.locals и в заголовок
// ответа, чтобы клиент мог сослаться на конкретный запрос в саппорте.
const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incoming = req.headers["x-request-id"];
  const requestId =
    typeof incoming === "string" && incoming.length > 0
      ? incoming
      : randomUUID();

  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

export default requestIdMiddleware;
