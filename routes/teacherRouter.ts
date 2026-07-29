import { Router } from "express";
import teacherController from "../controllers/teacherController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";
import { UserRole } from "../models/user/type.ts";
import {
  assignClassSchema,
  assignSubjectSchema,
} from "../schemas/teacher.schema.ts";

const router = Router();

router.use(authMiddleware);

// Профиль учителя (сам учитель или админ)
router.get(
  "/:teacherId",
  requireRole(UserRole.TEACHER, UserRole.ADMIN),
  teacherController.getProfile,
);

// === КЛАССЫ ===
router.get(
  "/:teacherId/classes",
  requireRole(UserRole.TEACHER, UserRole.ADMIN),
  teacherController.getClasses,
);

// Назначать/снимать классы — только админ
router.post(
  "/:teacherId/classes",
  requireRole(UserRole.ADMIN),
  validate({ body: assignClassSchema }),
  teacherController.assignClass,
);

router.delete(
  "/:teacherId/classes/:className",
  requireRole(UserRole.ADMIN),
  teacherController.removeClass,
);

// === ПРЕДМЕТЫ ===
router.get(
  "/:teacherId/subjects",
  requireRole(UserRole.TEACHER, UserRole.ADMIN),
  teacherController.getSubjects,
);

router.post(
  "/:teacherId/subjects",
  requireRole(UserRole.ADMIN),
  validate({ body: assignSubjectSchema }),
  teacherController.assignSubject,
);

router.delete(
  "/:teacherId/subjects/:subject",
  requireRole(UserRole.ADMIN),
  teacherController.removeSubject,
);

export default router;
