import {TASK_PRIORITY, TASK_STATUS} from '@/constants';

export type TaskPriority = ValueOf<typeof TASK_PRIORITY>;
export type TaskStatus = ValueOf<typeof TASK_STATUS>;

export interface ITask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  attachedImages?: string[];
}

export interface ITaskHeader {
  id: string;
  name: string;
}
