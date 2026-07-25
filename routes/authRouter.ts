import { Router, type Request, type Response } from "express";

const router = Router();

// POST /api/auth/login - вход в систему
router.post("/login", async (req: Request, res: Response) => {
  res.json({ message: "POST /api/auth/login (заглушка)" });
});

// GET /api/auth/me - получить текущего пользователя
router.get("/me", async (req: Request, res: Response) => {
  res.json({ message: "GET /api/auth/me (заглушка)" });
});

export default router;
