import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import type { TestResultAttributes } from "./type.ts";

interface TestResultCreationAttributes extends Optional<
  TestResultAttributes,
  "id" | "completedAt" | "isAvailable"
> {}

export class TestResult
  extends Model<TestResultAttributes, TestResultCreationAttributes>
  implements TestResultAttributes
{
  public id!: number;
  public studentId!: number;
  public testId!: number;
  public score!: number;
  public totalQuestions!: number;
  public answers!: number[];
  public completedAt!: Date;
  public isAvailable!: boolean;

  // Связи
  //   public getStudent!: () => Promise<User>;
  //   public getTest!: () => Promise<Test>;
}
export const initTestResultModel = (sequelize: Sequelize) => {
  TestResult.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalQuestions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      completedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // По умолчанию результат недоступен
      },
    },
    {
      sequelize,
      modelName: "test_result",
      tableName: "test_results",
    },
  );
};
