import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

// Использование в роуте:
//   router.post("/", validate({ body: createUserSchema }), userController.create);
//
// При ошибке валидации схема кидает ZodError, его ловит errorMiddleware
// и превращает в аккуратный 400 со списком полей.
const validate = (schemas: Schemas) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as typeof req.params;
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as typeof req.query;
      }
      next();
    } catch (error) {
      next(error); // ZodError уйдёт в errorMiddleware
    }
  };
};

export default validate;
