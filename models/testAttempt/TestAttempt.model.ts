import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import {
  AttemptStatus,
  type AttemptStatusType,
  type TestAttemptAttributes,
} from "./type.ts";

interface TestAttemptCreationAttributes extends Optional<
  TestAttemptAttributes,
  "id" | "finishedAt" | "score" | "totalQuestions" | "answers" | "status"
> {}

export class TestAttempt
  extends Model<TestAttemptAttributes, TestAttemptCreationAttributes>
  implements TestAttemptAttributes
{
  declare id: number;
  declare studentId: number;
  declare testId: number;
  declare startedAt: Date;
  declare finishedAt: Date | null;
  declare status: AttemptStatusType;
  declare score: number | null;
  declare totalQuestions: number | null;
  declare answers: number[] | null;
}

export const initTestAttemptModel = (sequelize: Sequelize) => {
  TestAttempt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(AttemptStatus)),
        allowNull: false,
        defaultValue: AttemptStatus.IN_PROGRESS,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TestAttempt",
      tableName: "test_attempts",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["studentId", "testId"], // один ученик = одна попытка на тест
        },
      ],
    },
  );
};
