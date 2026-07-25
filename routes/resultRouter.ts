import { Router, type Request, type Response } from "express";

const router = Router();

// POST /api/results - отправить результат (школьник сдал тест)
router.post("/", async (req: Request, res: Response) => {
  res.json({ message: "POST /api/results (заглушка)" });
});

// GET /api/results/my - мои результаты (для школьника)
router.get("/my", async (req: Request, res: Response) => {
  res.json({ message: "GET /api/results/my (заглушка)" });
});

// GET /api/results/student/:studentId - результаты школьника (для учителя/админа)
router.get("/student/:studentId", async (req: Request, res: Response) => {
  res.json({
    message: `GET /api/results/student/${req.params.studentId} (заглушка)`,
  });
});

// GET /api/results/test/:testId - результаты по тесту (для учителя)
router.get("/test/:testId", async (req: Request, res: Response) => {
  res.json({
    message: `GET /api/results/test/${req.params.testId} (заглушка)`,
  });
});

// PUT /api/results/:id/availability - изменить доступность результата
router.put("/:id/availability", async (req: Request, res: Response) => {
  res.json({
    message: `PUT /api/results/${req.params.id}/availability (заглушка)`,
  });
});

export default router;
