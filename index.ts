import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает! 🎉" });
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("❌ Ошибка при запуске сервера:", error);
    process.exit(1);
  }
};

start();
