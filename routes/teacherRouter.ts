import { Router, type Request, type Response } from "express";

const router = Router();

// GET /api/teachers/:teacherId/classes - получить классы учителя
router.get("/:teacherId/classes", async (req: Request, res: Response) => {
  res.json({
    message: `GET /api/teachers/${req.params.teacherId}/classes (заглушка)`,
  });
});

// POST /api/teachers/:teacherId/classes - добавить класс учителю
router.post("/:teacherId/classes", async (req: Request, res: Response) => {
  res.json({
    message: `POST /api/teachers/${req.params.teacherId}/classes (заглушка)`,
  });
});

// DELETE /api/teachers/:teacherId/classes/:className - убрать класс у учителя
router.delete(
  "/:teacherId/classes/:className",
  async (req: Request, res: Response) => {
    res.json({
      message: `DELETE /api/teachers/${req.params.teacherId}/classes/${req.params.className} (заглушка)`,
    });
  },
);

export default router;
