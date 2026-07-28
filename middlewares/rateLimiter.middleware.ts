import rateLimit from "express-rate-limit";

// На /auth/login: 10 попыток за 15 минут с одного IP.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Слишком много попыток входа. Попробуйте позже." },
});

// Общий лимит на весь /api.
export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Слишком много запросов, попробуйте чуть позже." },
});
