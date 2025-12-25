import { create } from 'zustand';
import { Task } from '../types/task';

interface TaskStore {
  tasks: Task[];
  selectedDate: string;
  selectedIndex: number;
  isCreating: boolean;
  setTasks: (tasks: Task[]) => void;
  setSelectedDate: (date: string) => void;
  setSelectedIndex: (index: number) => void;
  setIsCreating: (v: boolean) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  selectedDate: new Date().toISOString().slice(0, 10),
  selectedIndex: 0,
  isCreating: false,
  setTasks: (tasks) => set({ tasks }),
  setSelectedDate: (selectedDate) => set({ selectedDate, selectedIndex: 0 }),
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
  setIsCreating: (isCreating) => set({ isCreating }),
}));

