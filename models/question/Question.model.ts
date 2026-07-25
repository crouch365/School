import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import type { QuestionAttributes } from "./type.ts";

interface QuestionCreationAttributes extends Optional<
  QuestionAttributes,
  "id"
> {}

export class Question
  extends Model<QuestionAttributes, QuestionCreationAttributes>
  implements QuestionAttributes
{
  declare id: number;
  declare testId: number;
  declare text: string;
  declare options: string[];
  declare correctOptionIndex: number;
}

export const initQuestionModel = (sequelize: Sequelize) => {
  Question.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.JSONB, // Postgres
        allowNull: false,
      },
      correctOptionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "questions",
      timestamps: true,
    },
  );
};
