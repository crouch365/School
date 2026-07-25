import { DataTypes, Model, Sequelize, type Optional } from "sequelize";
import type { TestAccessAttributes } from "./type.ts";

interface TestAccessCreationAttributes extends Optional<
  TestAccessAttributes,
  "id" | "isOpen" | "openedAt" | "closedAt"
> {}

export class TestAccess
  extends Model<TestAccessAttributes, TestAccessCreationAttributes>
  implements TestAccessAttributes
{
  declare id: number;
  declare testId: number;
  declare className: string;
  declare isOpen: boolean;
  declare openedAt: Date | null;
  declare closedAt: Date | null;
}

export const initTestAccessModel = (sequelize: Sequelize) => {
  TestAccess.init(
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
      className: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      openedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TestAccess",
      tableName: "test_accesses",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["testId", "className"],
        },
      ],
    },
  );
};
