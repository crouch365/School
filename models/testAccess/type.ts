export interface TestAccessAttributes {
  id: number;
  testId: number;
  className: string;
  isOpen: boolean;
  openedAt: Date | null;
  closedAt: Date | null;
}
