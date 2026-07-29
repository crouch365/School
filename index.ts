import dotenv from "dotenv";
dotenv.config();

const requiredEnv = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Не задана переменная окружения: ${key}`);
    process.exit(1);
  }
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routes/index.ts";
import requestLogger from "./middlewares/requestLogger.middleware.ts";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.ts";
import notFoundMiddleware from "./middlewares/notFound.middleware.ts";
import errorMiddleware from "./middlewares/error.middleware.ts";
import { initModels } from "./models/index.ts";
import sequelize from "./config/db.ts";

const PORT = Number(process.env.PORT) || 5001;
const isProd = process.env.NODE_ENV === "production";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", globalRateLimiter, router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    initModels(sequelize);
    await sequelize.authenticate();

    // В проде — только миграции. sync здесь только для разработки.
    if (!isProd) {
      await sequelize.sync();
    }

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("❌ Ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

start();
