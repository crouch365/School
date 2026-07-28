import type { Request, Response, NextFunction } from "express";
import { TestAttempt as TestAttemptModel } from "../models/testAttempt/TestAttempt.model.ts";
import { Test } from "../models/test/Test.model.js";
import { Question } from "../models/question/Question.model.ts";
import { AttemptStatus } from "../models/testAttempt/type.ts";

class TestAttemptController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, testId, answers } = req.body;

      // 1. Находим попытку или создаем новую
      let attempt = await TestAttemptModel.findOne({
        where: { studentId, testId },
      });

      const test = await Test.findByPk(testId, {
        include: [{ model: Question, as: "questions" }],
      });
      if (!test) return res.status(404).json({ message: "Тест не найден" });

      // 2. Если попытки не было, создаем её (старт)
      if (!attempt) {
        attempt = await TestAttemptModel.create({
          studentId,
          testId,
          startedAt: new Date(),
          status: AttemptStatus.IN_PROGRESS,
        });
      }

      // 3. ПРОВЕРКА ТАЙМЕРА НА СЕРВЕРЕ
      const startTime = new Date(attempt.startedAt).getTime();
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);

      if (elapsedSeconds > (test as any).timeLimit) {
        await attempt.update({ status: AttemptStatus.EXPIRED });
        return res.status(400).json({
          message: "Время на выполнение теста истекло",
          elapsedSeconds,
          timeLimit: (test as any).timeLimit,
        });
      }

      // 4. ПРОВЕРКА КОЛИЧЕСТВА ОТВЕТОВ
      if (answers.length !== (test as any).questions.length) {
        return res.status(400).json({
          message: "Количество ответов не совпадает с количеством вопросов",
        });
      }

      // 5. ПОДСЧЕТ БАЛЛОВ НА СЕРВЕРЕ
      let score = 0;
      (test as any).questions.forEach((question: any, index: number) => {
        if (answers[index] === question.correctOptionIndex) {
          score++;
        }
      });

      // 6. СОХРАНЕНИЕ РЕЗУЛЬТАТА
      await attempt.update({
        status: AttemptStatus.COMPLETED,
        finishedAt: new Date(),
        score,
        totalQuestions: (test as any).questions.length,
        answers,
      });

      res.status(200).json({
        id: attempt.id,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        message: "Результат сохранен. Ожидайте проверки учителем.",
      });
    } catch (error) {
      console.error("TestAttemptController.submit error:", error);
      res.status(500).json({ message: "Ошибка при сохранении результата" });
    }
  }

  async getMy(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.query;

      const attempts = await TestAttemptModel.findAll({
        where: { studentId, status: AttemptStatus.COMPLETED },
        include: [
          { model: Test, as: "test", attributes: ["id", "title", "subject"] },
        ],
        order: [["finishedAt", "DESC"]],
      });

      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении результатов" });
    }
  }

  async getByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // Учитель видит ВСЁ: и ответы ученика, и правильные ответы для анализа
      const attempts = await TestAttemptModel.findAll({
        where: { studentId: req.params.studentId },
        include: [
          {
            model: Test,
            as: "test",
            include: [{ model: Question, as: "questions" }],
          },
        ],
      });
      res.json(attempts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ошибка при получении результатов ученика" });
    }
  }
}

export default new TestAttemptController();
