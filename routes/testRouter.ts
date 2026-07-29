import { Router } from "express";
import testController from "../controllers/testController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import { UserRole } from "../models/user/type.ts";

const router = Router();

router.use(authMiddleware); // все роуты ниже требуют авторизации

// === ТЕСТЫ ===
// Чтение доступно всем ролям — каждый метод контроллера сам решает, что показать
router.get("/", testController.getAll);
router.get("/:id", testController.getOne);

// Изменения — только учитель (своих тестов) и админ
const canManageTests = requireRole(UserRole.TEACHER, UserRole.ADMIN);

router.post("/", canManageTests, testController.create);
router.put("/:id", canManageTests, testController.update);
router.delete("/:id", canManageTests, testController.delete);

// === ВОПРОСЫ ===
router.post("/:testId/questions", canManageTests, testController.addQuestion);
router.put(
  "/:testId/questions/:questionId",
  canManageTests,
  testController.updateQuestion,
);
router.delete(
  "/:testId/questions/:questionId",
  canManageTests,
  testController.deleteQuestion,
);

export default router;
