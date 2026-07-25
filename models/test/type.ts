export interface TestAttributes {
  id: number;
  teacherId: number;
  subject: string;
  title: string;
  description: string | null;
  timeLimit: number; // секунды
}
