import { Router } from "express";
import testAccessController from "../controllers/testAccessController.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import requireRole from "../middlewares/role.middleware.ts";
import { UserRole } from "../models/user/type.ts";

const router = Router();

router.use(authMiddleware, requireRole(UserRole.TEACHER, UserRole.ADMIN));

// PUT /api/tests/access/grant  { testId, className }
router.put("/access/grant", testAccessController.grantAccess);
// PUT /api/tests/access/revoke { testId, className }
router.put("/access/revoke", testAccessController.revokeAccess);

export default router;
