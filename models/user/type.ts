export const UserRole = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface UserAttributes {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoleType;
  className?: string | null; // только для учеников
}
