import { DataTypes, Model, Sequelize } from "sequelize";
import type { TeacherClassAttributes } from "./type.ts";

export class TeacherClass
  extends Model<TeacherClassAttributes>
  implements TeacherClassAttributes
{
  declare teacherId: number;
  declare className: string;
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
        type: DataTypes.STRING(20),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "TeacherClass",
      tableName: "teacher_classes",
      timestamps: false,
    },
  );
};
