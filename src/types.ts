export interface ITodo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}
