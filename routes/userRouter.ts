// routes/userRouter.ts
import { Router } from "express";
import userController from "../controllers/userController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import validate from "../middlewares/validate.middleware.ts";
import { UserRole } from "../models/user/type.ts";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.ts";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.ADMIN));

router.get("/", userController.getAll);
router.get("/:id", userController.getOne);
router.post("/", validate({ body: createUserSchema }), userController.create);
router.put("/:id", validate({ body: updateUserSchema }), userController.update);
router.delete("/:id", userController.delete);

export default router;
