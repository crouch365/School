import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import type { QuestionAttributes } from "./type.ts";

export interface QuestionCreationAttributes extends Optional<
  QuestionAttributes,
  "id"
> {}

export class Question
  extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes
{
  declare public id: number;
  declare public testId: number;
  declare public text: string;
  declare public options: string[];
  declare public correctOptionIndex: number;

  // Связь с тестом
  //   public getTest!: () => Promise<Test>;
}

export const initQuestionModel = (sequelize: Sequelize) => {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      testId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSON, // Храним как JSON массив строк
        allowNull: false,
      },
      correctOptionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "question",
      tableName: "questions",
    },
  );
};
