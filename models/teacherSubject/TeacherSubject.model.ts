import { DataTypes, Model, Sequelize } from "sequelize";
import type { TeacherSubjectAttributes } from "./type.ts";

export class TeacherSubject
  extends Model<TeacherSubjectAttributes>
  implements TeacherSubjectAttributes
{
  declare teacherId: number;
  declare subject: string;
}

export const initTeacherSubjectModel = (sequelize: Sequelize) => {
  TeacherSubject.init(
    {
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "TeacherSubject",
      tableName: "teacher_subjects",
      timestamps: false,
    },
  );
};
