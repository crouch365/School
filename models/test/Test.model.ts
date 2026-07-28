// models/test/Test.model.ts
import {
  DataTypes,
  Model,
  Sequelize,
  type NonAttribute,
  type Optional,
} from "sequelize";
import type { TestAttributes } from "./type.ts";
import type { Question } from "../question/Question.model.ts";

interface TestCreationAttributes extends Optional<
  TestAttributes,
  "id" | "description"
> {}

export class Test
  extends Model<TestAttributes, TestCreationAttributes>
  implements TestAttributes
{
  declare id: number;
  declare teacherId: number;
  declare subject: string;
  declare title: string;
  declare description: string | null;
  declare timeLimit: number;

  // Заполняется только когда включено через `include: [{ as: "questions" }]`
  declare questions?: NonAttribute<Question[]>;
}

export const initTestModel = (sequelize: Sequelize) => {
  Test.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timeLimit: {
        type: DataTypes.INTEGER, // секунды
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Test",
      tableName: "tests",
      timestamps: true,
    },
  );
};
