import dotenv from "dotenv";
import express from "express";
import router from "./routes/index.ts";
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());
app.use("/api", router);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("❌ Ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

start();
