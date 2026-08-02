import jwt from "jsonwebtoken";
import type { UserRoleType } from "../models/user/type.ts";
import { env } from "../config/env.ts";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRoleType;
  className?: string | null;
}

export const generateJwt = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "12h" });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
