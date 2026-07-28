import type { Request, Response } from "express";

// Ставится ПОСЛЕ всех router.use(...), но ДО errorMiddleware.
const notFoundMiddleware = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ message: `Маршрут ${req.method} ${req.path} не найден` });
};

export default notFoundMiddleware;
