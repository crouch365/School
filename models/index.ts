import type { Sequelize } from "sequelize";

import { initUserModel, User } from "./user/User.model.ts";
import {
  initTeacherSubjectModel,
  TeacherSubject,
} from "./teacherSubject/TeacherSubject.model.ts";

import { initTestModel, Test } from "./test/Test.model.ts";
import {
  initTestAccessModel,
  TestAccess,
} from "./testAccess/TestAccess.model.ts";
import { initQuestionModel, Question } from "./question/Question.model.ts";
import {
  initTestAttemptModel,
  TestAttempt,
} from "./testAttempt/TestAttempt.model.ts";
import {
  initTeacherClassModel,
  TeacherClass,
} from "./teacherClass/TeacherClass.model.ts";

export const initModels = (sequelize: Sequelize) => {
  // 1. Инициализация
  initUserModel(sequelize);
  initTeacherSubjectModel(sequelize);
  initTeacherClassModel(sequelize);
  initTestModel(sequelize);
  initTestAccessModel(sequelize);
  initQuestionModel(sequelize);
  initTestAttemptModel(sequelize);

  // 2. Ассоциации

  // User ↔ TeacherSubject
  User.hasMany(TeacherSubject, {
    foreignKey: "teacherId",
    as: "subjects",
    onDelete: "CASCADE",
  });
  TeacherSubject.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher",
  });

  // User ↔ TeacherClass
  User.hasMany(TeacherClass, {
    foreignKey: "teacherId",
    as: "classes",
    onDelete: "CASCADE",
  });
  TeacherClass.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher",
  });

  // User (teacher) ↔ Test
  User.hasMany(Test, {
    foreignKey: "teacherId",
    as: "tests",
    onDelete: "CASCADE",
  });
  Test.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher",
  });

  // Test ↔ TestAccess
  Test.hasMany(TestAccess, {
    foreignKey: "testId",
    as: "accesses",
    onDelete: "CASCADE",
  });
  TestAccess.belongsTo(Test, {
    foreignKey: "testId",
    as: "test",
  });

  // Test ↔ Question
  Test.hasMany(Question, {
    foreignKey: "testId",
    as: "questions",
    onDelete: "CASCADE",
  });
  Question.belongsTo(Test, {
    foreignKey: "testId",
    as: "test",
  });

  // User (student) ↔ TestAttempt
  User.hasMany(TestAttempt, {
    foreignKey: "studentId",
    as: "attempts",
    onDelete: "CASCADE",
  });
  TestAttempt.belongsTo(User, {
    foreignKey: "studentId",
    as: "student",
  });

  // Test ↔ TestAttempt
  Test.hasMany(TestAttempt, {
    foreignKey: "testId",
    as: "attempts",
    onDelete: "CASCADE",
  });
  TestAttempt.belongsTo(Test, {
    foreignKey: "testId",
    as: "test",
  });
};

// Экспорт всех моделей
export {
  User,
  TeacherSubject,
  TeacherClass,
  Test,
  TestAccess,
  Question,
  TestAttempt,
};
