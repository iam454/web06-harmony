import { Task } from '@/project/entity/task.entity';

export class PositionUpdatedEvent {
  constructor(task: Task) {
    this.id = task.id;
    this.sectionId = task.section.id;
    this.position = task.position;
  }

  id: number;

  sectionId: number;

  position: string;
}
