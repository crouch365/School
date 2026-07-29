import { Router } from "express";
import testAttemptController from "../controllers/testAttemptController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import { UserRole } from "../models/user/type.ts";

const router = Router();

router.use(authMiddleware);

// POST /api/results - отправить ответы (только ученик, за самого себя)
router.post("/", requireRole(UserRole.STUDENT), testAttemptController.submit);

// GET /api/results/my - мои результаты (только ученик)
router.get("/my", requireRole(UserRole.STUDENT), testAttemptController.getMy);

// GET /api/results/student/:studentId - результаты ученика (учитель/админ)
router.get(
  "/student/:studentId",
  requireRole(UserRole.TEACHER, UserRole.ADMIN),
  testAttemptController.getByStudent,
);

export default router;
