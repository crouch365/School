import { Router, type Request, type Response } from "express";

const router = Router();

// GET /api/users - список всех пользователей
router.get("/", async (req: Request, res: Response) => {
  res.json({ message: "GET /api/users (заглушка)" });
});

// GET /api/users/:id - конкретный пользователь
router.get("/:id", async (req: Request, res: Response) => {
  res.json({ message: `GET /api/users/${req.params.id} (заглушка)` });
});

// POST /api/users - создать пользователя (админ создает, генерирует логин/пароль)
router.post("/", async (req: Request, res: Response) => {
  res.json({ message: "POST /api/users (заглушка)" });
});

// PUT /api/users/:id - изменить пользователя
router.put("/:id", async (req: Request, res: Response) => {
  res.json({ message: `PUT /api/users/${req.params.id} (заглушка)` });
});

// DELETE /api/users/:id - удалить пользователя
router.delete("/:id", async (req: Request, res: Response) => {
  res.json({ message: `DELETE /api/users/${req.params.id} (заглушка)` });
});

export default router;
