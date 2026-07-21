import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { UserAttributes, UserRole } from "./type";

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare public id: number;
  declare public name: string;
  declare public lastName: string;
  declare public email: string;
  declare public password: string;
  declare public role: UserRole;
  public subject?: string;
  public className?: string;

  public getResults!: () => Promise<TestResult[]>;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
        defaultValue: UserRole.STUDENT,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      className: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "user",
      tableName: "user",
    },
  );
};
