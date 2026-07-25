export interface TestResultAttributes {
  id: number;
  studentId: number;
  testId: number;
  score: number; // Количество правильных ответов
  totalQuestions: number; // Общее количество вопросов
  answers: number[]; // Массив выбранных индексов ответов
  completedAt: Date;
  isAvailable: boolean; // Доступен ли результат для просмотра (для задержки)
}
