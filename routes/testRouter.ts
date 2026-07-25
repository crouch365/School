import { Router, type Request, type Response } from "express";

const router = Router();

// === ТЕСТЫ ===

// GET /api/tests - список тестов
router.get("/", async (req: Request, res: Response) => {
  res.json({ message: "GET /api/tests (заглушка)" });
});

// GET /api/tests/:id - тест с вопросами
router.get("/:id", async (req: Request, res: Response) => {
  res.json({ message: `GET /api/tests/${req.params.id} (заглушка)` });
});

// POST /api/tests - создать тест
router.post("/", async (req: Request, res: Response) => {
  res.json({ message: "POST /api/tests (заглушка)" });
});

// PUT /api/tests/:id - изменить тест
router.put("/:id", async (req: Request, res: Response) => {
  res.json({ message: `PUT /api/tests/${req.params.id} (заглушка)` });
});

// DELETE /api/tests/:id - удалить тест
router.delete("/:id", async (req: Request, res: Response) => {
  res.json({ message: `DELETE /api/tests/${req.params.id} (заглушка)` });
});

// === ВОПРОСЫ ===

// POST /api/tests/:testId/questions - добавить вопрос к тесту
router.post("/:testId/questions", async (req: Request, res: Response) => {
  res.json({
    message: `POST /api/tests/${req.params.testId}/questions (заглушка)`,
  });
});

// PUT /api/tests/:testId/questions/:questionId - изменить вопрос
router.put(
  "/:testId/questions/:questionId",
  async (req: Request, res: Response) => {
    res.json({
      message: `PUT /api/tests/${req.params.testId}/questions/${req.params.questionId} (заглушка)`,
    });
  },
);

// DELETE /api/tests/:testId/questions/:questionId - удалить вопрос
router.delete(
  "/:testId/questions/:questionId",
  async (req: Request, res: Response) => {
    res.json({
      message: `DELETE /api/tests/${req.params.testId}/questions/${req.params.questionId} (заглушка)`,
    });
  },
);

export default router;
