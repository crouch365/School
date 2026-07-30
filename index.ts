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
import requestIdMiddleware from "./middlewares/requestId.middleware.ts";
import logger from "./utils/logger.ts";

const PORT = Number(process.env.PORT) || 5001;
const isProd = process.env.NODE_ENV === "production";

// В проде CORS_ORIGIN обязателен и явный список — никаких "разрешить всем"
// вместе с credentials: true. В деве, если переменная не задана, разрешаем
// localhost, чтобы не мешать локальной разработке фронта.
const corsOrigin = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim());
if (isProd && !corsOrigin) {
  console.error(
    "❌ В production обязательно нужен CORS_ORIGIN (список разрешённых доменов через запятую)",
  );
  process.exit(1);
}

const app = express();

// Если сервер стоит за реверс-прокси (nginx, Cloud Load Balancer и т.п.),
// без этого express-rate-limit будет считать лимиты по IP самого прокси,
// а не реального клиента, и все запросы упрутся в один и тот же лимит.
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin ?? ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestIdMiddleware);
app.use(requestLogger);

app.get("/health", async (_req, res) => {
  try {
    // Настоящий health-check: не просто "процесс жив", а "может достучаться до БД".
    // Иначе оркестратор (k8s/docker) считает под здоровым, пока БД лежит.
    await sequelize.authenticate();
    res.json({ status: "ok", db: "up" });
  } catch {
    res.status(503).json({ status: "error", db: "down" });
  }
});

app.use("/api", globalRateLimiter, router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

let server: ReturnType<typeof app.listen> | undefined;

const start = async () => {
  try {
    initModels(sequelize);
    await sequelize.authenticate();

    // В проде — только миграции (см. package.json -> "migrate").
    // sync() здесь только для локальной разработки.
    if (!isProd) {
      await sequelize.sync();
    }

    server = app.listen(PORT, () =>
      logger.info(`Server started on port ${PORT}`),
    );
  } catch (error) {
    logger.error({ err: error }, "❌ Ошибка при запуске сервера");
    process.exit(1);
  }
};

// Graceful shutdown: даём текущим запросам доехать, закрываем HTTP-сервер
// и пул соединений с БД, только потом завершаем процесс. Без этого при
// деплое/рестарте (docker stop, k8s rolling update) активные запросы
// обрываются жёстко.
const shutdown = async (signal: string) => {
  logger.info(`Получен ${signal}, начинаю graceful shutdown...`);

  const forceExitTimeout = setTimeout(() => {
    logger.error("Не успели закрыться за 10s, выходим принудительно");
    process.exit(1);
  }, 10_000);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server!.close((err) => (err ? reject(err) : resolve()));
      });
    }
    await sequelize.close();
    clearTimeout(forceExitTimeout);
    logger.info("Сервер остановлен корректно");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Ошибка при остановке сервера");
    process.exit(1);
  }
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

start();
