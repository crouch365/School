import { Router } from "express";
import authRouter from "./authRouter.ts";
import userRouter from "./userRouter.ts";
import testRouter from "./testRouter.ts";
import testAccessRouter from "./testAccessRouter.ts";
import resultRouter from "./resultRouter.ts";
import teacherRouter from "./teacherRouter.ts";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/tests", testAccessRouter);
router.use("/tests", testRouter);
router.use("/results", resultRouter);
router.use("/teachers", teacherRouter);

export default router;
