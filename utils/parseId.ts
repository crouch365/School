import ApiError from "../errors/ApiError.ts";

export const parseIdParam = (raw: unknown, paramName = "id"): number => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  if (!value || Number.isNaN(id)) {
    throw ApiError.badRequest(`Некорректный параметр ${paramName}`);
  }
  return id;
};
