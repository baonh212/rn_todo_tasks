import {faker} from '@faker-js/faker';
import {ITask} from '@/types';
import {TASK_PRIORITY, TASK_STATUS} from '@/constants';

const generateTasks = (count: number): ITask[] => {
  const priorities = [
    TASK_PRIORITY.LOW,
    TASK_PRIORITY.MEDIUM,
    TASK_PRIORITY.HIGH,
  ];
  const statuses = [
    TASK_STATUS.TO_DO,
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.COMPLETED,
  ];

  const tasks: ITask[] = [];
  for (let i = 0; i < count; i++) {
    tasks.push({
      id: faker.string.uuid(),
      title: faker.lorem.words(5),
      description: faker.lorem.sentences(2),
      dueDate: faker.date
        .soon({days: Math.floor(Math.random() * 10) + 1})
        .toISOString(),
      priority: faker.helpers.arrayElement(priorities),
      status: faker.helpers.arrayElement(statuses),
      attachedImages: [],
    });
  }
  return tasks;
};

export {generateTasks};
