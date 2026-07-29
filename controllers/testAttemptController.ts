import type { Request, Response, NextFunction } from "express";
import { TestAttempt } from "../models/testAttempt/TestAttempt.model.ts";
import { Test } from "../models/test/Test.model.ts";
import { Question } from "../models/question/Question.model.ts";
import { TestAccess } from "../models/testAccess/TestAccess.model.ts";
import { AttemptStatus } from "../models/testAttempt/type.ts";
import { UserRole } from "../models/user/type.ts";
import ApiError from "../errors/ApiError.ts";

class TestAttemptController {
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const studentId = user.id;
      const { testId, answers } = req.body as {
        testId: number;
        answers: { questionId: number; optionIndex: number }[];
      };

      const test = await Test.findByPk(testId, {
        include: [{ model: Question, as: "questions" }],
      });
      if (!test) return next(ApiError.notFound("Тест не найден"));

      if (!user.className) {
        return next(ApiError.forbidden("Вам не назначен класс"));
      }

      const access = await TestAccess.findOne({
        where: {
          testId: test.id,
          className: user.className,
          isOpen: true,
        },
      });
      if (!access) {
        return next(
          ApiError.forbidden(
            "Доступ к этому тесту закрыт или не назначен вашему классу",
          ),
        );
      }

      const [attempt] = await TestAttempt.findOrCreate({
        where: { studentId, testId },
        defaults: {
          studentId,
          testId,
          startedAt: new Date(),
          status: AttemptStatus.IN_PROGRESS,
        },
      });

      if (attempt.status === AttemptStatus.COMPLETED) {
        return next(
          ApiError.badRequest("Тест уже сдан, повторная попытка недоступна"),
        );
      }

      const startTime = new Date(attempt.startedAt).getTime();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

      if (elapsedSeconds > test.timeLimit) {
        await attempt.update({ status: AttemptStatus.EXPIRED });
        return next(
          ApiError.badRequest(
            `Время на выполнение теста истекло (${elapsedSeconds}s > ${test.timeLimit}s)`,
          ),
        );
      }

      const questions = test.questions ?? [];
      if (answers.length !== questions.length) {
        return next(
          ApiError.badRequest(
            "Количество ответов не совпадает с количеством вопросов",
          ),
        );
      }

      const questionMap = new Map(questions.map((q) => [q.id, q]));
      let score = 0;
      const normalizedAnswers: number[] = [];

      for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (!question) {
          return next(
            ApiError.badRequest(
              `Вопрос id=${answer.questionId} не найден в тесте`,
            ),
          );
        }
        if (
          answer.optionIndex < 0 ||
          answer.optionIndex >= question.options.length
        ) {
          return next(
            ApiError.badRequest(
              `Некорректный optionIndex для вопроса id=${answer.questionId}`,
            ),
          );
        }
        if (answer.optionIndex === question.correctOptionIndex) {
          score++;
        }
        // сохраняем в том же порядке, что questions (по id — для истории)
        normalizedAnswers.push(answer.optionIndex);
      }

      await attempt.update({
        status: AttemptStatus.COMPLETED,
        finishedAt: new Date(),
        score,
        totalQuestions: questions.length,
        answers: normalizedAnswers,
      });

      res.status(200).json({
        id: attempt.id,
        score,
        totalQuestions: questions.length,
        message: "Результат сохранён",
      });
    } catch (error) {
      next(error);
    }
  }

  async getMy(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.user!.id; // всегда свои результаты, id не из query

      const attempts = await TestAttempt.findAll({
        where: { studentId, status: AttemptStatus.COMPLETED },
        include: [
          { model: Test, as: "test", attributes: ["id", "title", "subject"] },
        ],
        order: [["finishedAt", "DESC"]],
      });

      res.json(attempts);
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const studentId = req.params.studentId;

      // Учитель видит результаты ученика только по своим тестам,
      // не по всем предметам подряд. Админ видит всё.
      const testWhere =
        user.role === UserRole.TEACHER ? { teacherId: user.id } : undefined;

      const attempts = await TestAttempt.findAll({
        where: { studentId },
        include: [
          {
            model: Test,
            as: "test",
            where: testWhere,
            required: true,
            include: [{ model: Question, as: "questions" }],
          },
        ],
      });
      res.json(attempts);
    } catch (error) {
      next(error);
    }
  }
}

export default new TestAttemptController();
