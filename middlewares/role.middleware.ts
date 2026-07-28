import type { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError.ts";
import type { UserRoleType } from "../models/user/type.ts";

const requireRole = (...roles: UserRoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(ApiError.forbidden("Недостаточно прав для этого действия"));
      return;
    }
    next();
  };
};

export default requireRole;
