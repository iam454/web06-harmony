import { Subtask } from '@/features/task/subtask/types.ts';
import { Assignee, Label, Sprint } from '@/features/types.ts';

export interface UpdateTaskDto {
  description?: string;
  priority?: number | null;
  sprintId?: number | null;
  estimate?: number | null;
}

export interface DetailedTask {
  id: number;
  title: string;
  description: string;
  priority: number;
  estimate: number;
  sprint: Sprint;
  assignees: Assignee[];
  labels: Label[];
  subtasks: Subtask[];
}

export type Priority = number;

export type Estimate = number;
