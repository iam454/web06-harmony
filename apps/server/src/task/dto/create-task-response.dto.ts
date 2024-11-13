import { Task } from '../domain/task.entity';

export class CreateTaskResponse {
  constructor(task: Task) {
    this.id = task.id;
    this.position = task.position;
  }

  id: number;

  position: string;
}
