import { DataTypes, Model, Sequelize } from "sequelize";
import type { TeacherClassAttributes } from "./type.ts";

export class TeacherClass
  extends Model<TeacherClassAttributes>
  implements TeacherClassAttributes
{
  public teacherId!: number;
  public className!: string;
}

export const initTeacherClassModel = (sequelize: Sequelize) => {
  TeacherClass.init(
    {
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      className: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "teacher_class",
      tableName: "teacher_classes",
      timestamps: false, // Не нужны createdAt/updatedAt
    },
  );
};
