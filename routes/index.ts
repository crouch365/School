import { Router } from "express";
import authRouter from "./authRouter.ts";
import userRouter from "./userRouter.ts";
import testRouter from "./testRouter.ts";
import resultRouter from "./resultRouter.ts";
import teacherRouter from "./teacherRouter.ts";

const router = Router();

router.use("/auth", authRouter); // /api/auth/*
router.use("/users", userRouter); // /api/users/*
router.use("/tests", testRouter); // /api/tests/*
router.use("/results", resultRouter); // /api/results/*
router.use("/teachers", teacherRouter); // /api/teachers/*

export default router;
