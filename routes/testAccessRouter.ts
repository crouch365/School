import { Router } from "express";
import testAccessController from "../controllers/testAccessController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import { UserRole } from "../models/user/type.ts";
import validate from "../middlewares/validate.middleware.ts";
import {
  grantAccessSchema,
  revokeAccessSchema,
} from "../schemas/test.schema.ts";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.TEACHER, UserRole.ADMIN));

router.put(
  "/access/grant",
  validate({ body: grantAccessSchema }),
  testAccessController.grantAccess,
);

router.put(
  "/access/revoke",
  validate({ body: revokeAccessSchema }),
  testAccessController.revokeAccess,
);

export default router;
