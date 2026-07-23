import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import type { TestAttributes } from "./type.ts";

interface TestCreationAttributes extends Optional<TestAttributes, "id"> {}

export class Test
  extends Model<TestAttributes, TestCreationAttributes>
  implements TestAttributes
{
  declare public id: number;
  declare public title: string;
  declare public description: string;
  declare public timeLimit: number;
  declare public targetClassName: string;

  // Методы для связей
  //   public getQuestions!: () => Promise<Question[]>;
  //   public getResults!: () => Promise<TestResult[]>;
}

export const initTEstModel = (sequelize: Sequelize) => {
  Test.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timeLimit: {
        type: DataTypes.INTEGER, // В секундах
        allowNull: false,
      },
      targetClassName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "test",
      tableName: "tests",
    },
  );
};
