import dotenv from "dotenv";
dotenv.config();

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

const PORT = process.env.PORT || 5001;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api", globalRateLimiter, router);

// Порядок важен: сначала все роуты, потом 404, потом error-handler.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const start = async () => {
  try {
    initModels(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("❌ Ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

start();
