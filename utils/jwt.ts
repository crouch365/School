import jwt from "jsonwebtoken";
import type { UserRoleType } from "../models/user/type.ts";

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRoleType;
  className?: string | null; // актуально только для роли STUDENT
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET не задан в переменных окружения");
  }
  return secret;
};

export const generateJwt = (payload: JwtPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: "12h" });
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};
