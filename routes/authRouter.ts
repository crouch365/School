// routes/authRouter.ts
import { Router } from "express";
import authController from "../controllers/authController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";
import { loginRateLimiter } from "../middlewares/rateLimiter.middleware.ts";
import { loginSchema } from "../schemas/auth.schema.ts";

const router = Router();

router.post(
  "/login",
  loginRateLimiter,
  validate({ body: loginSchema }),
  authController.login,
);
router.get("/me", authMiddleware, authController.check);

export default router;
