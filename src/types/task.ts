export interface Task {
  id: number;
  title: string;
  notes?: string;
  date: string;
  completed: number;
  created_at: Date;
  updated_at: Date;
}

