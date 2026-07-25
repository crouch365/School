export const AttemptStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  EXPIRED: "EXPIRED",
} as const;

export type AttemptStatusType =
  (typeof AttemptStatus)[keyof typeof AttemptStatus];

export interface TestAttemptAttributes {
  id: number;
  studentId: number;
  testId: number;
  startedAt: Date;
  finishedAt: Date | null;
  status: AttemptStatusType;
  score: number | null;
  totalQuestions: number | null;
  answers: number[] | null;
}
