// Тут описаны типы к каждой модели

export enum UserRole {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export interface UserAttributes {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  subject?: string;
  className?: string;
}
