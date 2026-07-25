import type { Sequelize } from "sequelize";
import { initUserModel, User } from "./user/User.model.ts";
import { initTestModel, Test } from "./test/Test.model.ts";
import { initQuestionModel, Question } from "./question/Question.model.ts";
import {
  initTestResultModel,
  TestResult,
} from "./testResult/TestReuslt.model.ts";
import {
  initTeacherClassModel,
  TeacherClass,
} from "./teacherClasses/TeacherClasses.model.ts";

export const initModels = (sequelize: Sequelize) => {
  // Инициализируем все модели
  initUserModel(sequelize);
  initTestModel(sequelize);
  initQuestionModel(sequelize);
  initTestResultModel(sequelize);
  initTeacherClassModel(sequelize);

  // Test <-> Question (1 ко многим)
  Test.hasMany(Question, {
    foreignKey: "testId",
    as: "questions",
    onDelete: "CASCADE",
  });
  Question.belongsTo(Test, { foreignKey: "testId", as: "test" });

  // User <-> TestResult (1 ко многим)
  User.hasMany(TestResult, {
    foreignKey: "studentId",
    as: "results",
    onDelete: "CASCADE",
  });
  TestResult.belongsTo(User, { foreignKey: "studentId", as: "student" });

  // Test <-> TestResult (1 ко многим)
  Test.hasMany(TestResult, {
    foreignKey: "testId",
    as: "results",
    onDelete: "CASCADE",
  });
  TestResult.belongsTo(Test, { foreignKey: "testId", as: "test" });

  // User (Teacher) <-> TeacherClass (MANY-TO-MANY)
  User.belongsToMany(TeacherClass, {
    through: "teacher_classes",
    foreignKey: "teacherId",
    otherKey: "className",
    as: "allowedClasses",
  });

  TeacherClass.belongsTo(User, { foreignKey: "teacherId", as: "teacher" });
};

// Экспортируем все модели для использования в контроллерах
export { User, Test, Question, TestResult, TeacherClass };
