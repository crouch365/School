import { Test } from "../models/test/Test.model.js";
import { Question } from "../models/question/Question.model.js";
import { TestAccess } from "../models/testAccess/TestAccess.model.js";
import { UserRole } from "../models/user/type.js";
import type { NextFunction, Request, Response } from "express";

class TestController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.query.role as string; // В будущем заменим на извлечение из JWT
      const userClassName = req.query.className as string;

      if (userRole === UserRole.STUDENT && userClassName) {
        // Ученик видит только тесты, открытые для его класса
        const tests = await Test.findAll({
          include: [
            {
              model: TestAccess,
              as: "accesses", // Убедись, что alias в initModels называется "accesses"
              where: { className: userClassName, isOpen: true },
              attributes: [], // Не возвращаем саму запись доступа, только фильтруем по ней
            },
            {
              model: Question,
              as: "questions",
              attributes: ["id", "text", "options"], // БЕЗ correctOptionIndex
            },
          ],
        });
        return res.json(tests);
      }

      // Админ и учитель видят все тесты (учителю можно добавить фильтр по teacherId)
      const tests = await Test.findAll({
        include: [{ model: Question, as: "questions" }],
      });
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении тестов" });
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await Test.findByPk(req.params.id, {
        include: [{ model: Question, as: "questions" }],
      });
      if (!test) return res.status(404).json({ message: "Тест не найден" });

      const userRole = req.query.role as string;

      if (userRole === UserRole.STUDENT) {
        // Проверка доступа через TestAccess
        const access = await TestAccess.findOne({
          where: {
            testId: test.id,
            className: req.query.className,
            isOpen: true,
          },
        });
        if (!access) {
          return res.status(403).json({
            message:
              "Доступ к этому тесту закрыт или не назначен вашему классу",
          });
        }

        const safeQuestions = (test as any).questions.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: q.options,
        }));

        return res.json({
          id: test.id,
          teacherId: test.teacherId,
          subject: test.subject,
          title: test.title,
          description: test.description,
          timeLimit: test.timeLimit,
          questions: safeQuestions,
        });
      }

      // Учителю и админу отдаем всё, включая correctOptionIndex
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при получении теста" });
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { teacherId, subject, title, description, timeLimit } = req.body;
      const test = await Test.create({
        teacherId,
        subject,
        title,
        description,
        timeLimit,
      });
      res.status(201).json(test);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при создании теста" });
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await Test.findByPk(req.params.id);
      if (!test) return res.status(404).json({ message: "Тест не найден" });

      const { teacherId, subject, title, description, timeLimit } = req.body;
      await test.update({ teacherId, subject, title, description, timeLimit });
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении теста" });
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const test = await Test.findByPk(req.params.id);
      if (!test) return res.status(404).json({ message: "Тест не найден" });

      await test.destroy();
      res.json({ message: "Тест успешно удален" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении теста" });
    }
  }

  async addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, options, correctOptionIndex } = req.body;
      const question = await Question.create({
        testId: Number(req.params.testId),
        text,
        options,
        correctOptionIndex,
      });
      res.status(201).json(question);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при добавлении вопроса" });
    }
  }

  async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await Question.findByPk(req.params.questionId);
      if (!question || question.testId !== Number(req.params.testId)) {
        return res.status(404).json({ message: "Вопрос не найден" });
      }

      const { text, options, correctOptionIndex } = req.body;
      await question.update({ text, options, correctOptionIndex });
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Ошибка при обновлении вопроса" });
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await Question.findByPk(req.params.questionId);
      if (!question || question.testId !== Number(req.params.testId)) {
        return res.status(404).json({ message: "Вопрос не найден" });
      }

      await question.destroy();
      res.json({ message: "Вопрос успешно удален" });
    } catch (error) {
      res.status(500).json({ message: "Ошибка при удалении вопроса" });
    }
  }
}

export default new TestController();
