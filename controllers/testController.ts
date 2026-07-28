import { Test } from "../models/test/Test.model.ts";
import { Question } from "../models/question/Question.model.ts";
import { TestAccess } from "../models/testAccess/TestAccess.model.ts";
import { UserRole } from "../models/user/type.ts";
import ApiError from "../errors/ApiError.ts";
import { assertOwnsTest, assertTeachesSubject } from "../utils/ownership.ts";
import { parseIdParam } from "../utils/parseId.ts";
import type { NextFunction, Request, Response } from "express";

class TestController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;

      if (user.role === UserRole.STUDENT) {
        if (!user.className) {
          return res.json([]); // ученик без класса не видит тестов
        }
        const tests = await Test.findAll({
          include: [
            {
              model: TestAccess,
              as: "accesses",
              where: { className: user.className, isOpen: true },
              attributes: [],
            },
            {
              model: Question,
              as: "questions",
              attributes: ["id", "text", "options"], // без correctOptionIndex
            },
          ],
        });
        return res.json(tests);
      }

      if (user.role === UserRole.TEACHER) {
        // Учитель видит только свои тесты
        const tests = await Test.findAll({
          where: { teacherId: user.id },
          include: [{ model: Question, as: "questions" }],
        });
        return res.json(tests);
      }

      // ADMIN видит всё
      const tests = await Test.findAll({
        include: [{ model: Question, as: "questions" }],
      });
      res.json(tests);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(parseIdParam(req.params.id), {
        include: [{ model: Question, as: "questions" }],
      });
      if (!test) return next(ApiError.notFound("Тест не найден"));

      if (user.role === UserRole.STUDENT) {
        if (!user.className) {
          return next(ApiError.forbidden("Вам не назначен класс"));
        }
        const access = await TestAccess.findOne({
          where: { testId: test.id, className: user.className, isOpen: true },
        });
        if (!access) {
          return next(
            ApiError.forbidden(
              "Доступ к этому тесту закрыт или не назначен вашему классу",
            ),
          );
        }

        const safeQuestions = (test.questions ?? []).map((q) => ({
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

      if (user.role === UserRole.TEACHER) {
        assertOwnsTest(user, test);
      }

      // TEACHER (владелец) и ADMIN получают всё, включая correctOptionIndex
      res.json(test);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const { subject, title, description, timeLimit } = req.body;

      if (!subject || !title || !timeLimit) {
        return next(
          ApiError.badRequest("Не переданы subject, title или timeLimit"),
        );
      }

      // Учитель не может создать тест "от имени" другого учителя —
      // teacherId всегда берём из токена, а не из тела запроса.
      // Админ может явно указать teacherId (создаёт тест за учителя).
      const teacherId =
        user.role === UserRole.ADMIN
          ? (req.body.teacherId ?? user.id)
          : user.id;

      if (user.role === UserRole.TEACHER) {
        await assertTeachesSubject(user, subject);
      }

      const test = await Test.create({
        teacherId,
        subject,
        title,
        description,
        timeLimit,
      });
      res.status(201).json(test);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(parseIdParam(req.params.id));
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      const { subject, title, description, timeLimit } = req.body;
      await test.update({ subject, title, description, timeLimit });
      res.json(test);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(parseIdParam(req.params.id));
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      await test.destroy();
      res.json({ message: "Тест успешно удалён" });
    } catch (error) {
      next(error);
    }
  }

  async addQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(
        parseIdParam(req.params.testId, "testId"),
      );
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      const { text, options, correctOptionIndex } = req.body;
      if (
        !text ||
        !Array.isArray(options) ||
        options.length < 2 ||
        !Number.isInteger(correctOptionIndex) ||
        correctOptionIndex < 0 ||
        correctOptionIndex >= options.length
      ) {
        return next(
          ApiError.badRequest(
            "Некорректный вопрос: нужны text, минимум 2 options и correctOptionIndex в границах options",
          ),
        );
      }

      const question = await Question.create({
        testId: test.id,
        text,
        options,
        correctOptionIndex,
      });
      res.status(201).json(question);
    } catch (error) {
      next(error);
    }
  }

  async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(
        parseIdParam(req.params.testId, "testId"),
      );
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      const question = await Question.findByPk(
        parseIdParam(req.params.questionId, "questionId"),
      );
      if (!question || question.testId !== test.id) {
        return next(ApiError.notFound("Вопрос не найден"));
      }

      const { text, options, correctOptionIndex } = req.body;
      await question.update({ text, options, correctOptionIndex });
      res.json(question);
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const test = await Test.findByPk(
        parseIdParam(req.params.testId, "testId"),
      );
      if (!test) return next(ApiError.notFound("Тест не найден"));
      assertOwnsTest(user, test);

      const question = await Question.findByPk(
        parseIdParam(req.params.questionId, "questionId"),
      );
      if (!question || question.testId !== test.id) {
        return next(ApiError.notFound("Вопрос не найден"));
      }

      await question.destroy();
      res.json({ message: "Вопрос успешно удалён" });
    } catch (error) {
      next(error);
    }
  }
}

export default new TestController();
