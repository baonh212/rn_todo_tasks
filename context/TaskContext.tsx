import React, {createContext, useContext, useEffect, useState} from 'react';
import {ITask, ITaskHeader} from '@/types';
import {generateTasks} from '@/utils';
import {TASK_PRIORITY, TASK_STATUS} from '@/constants';

export interface TaskContextType {
  tasks: ITask[];
  filteredTasks: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  filterTasks: (props: {
    status: string;
    priority: string;
    dueDateRange: number;
  }) => void;
  headerColumns: ITaskHeader[];
  setHeaderColumns: React.Dispatch<React.SetStateAction<ITaskHeader[]>>;
  sortTasks: (sortBy: 'dueDate' | 'priority' | 'status') => void;
  updateTask: (newTask: ITask) => void;
  updateTaskImage: (taskId: ITask['id'], imageUrls: string | string[]) => void;
  resetFilterAndSort: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const priorityOrder = {
  [TASK_PRIORITY.LOW]: 1,
  [TASK_PRIORITY.MEDIUM]: 2,
  [TASK_PRIORITY.HIGH]: 3,
} as const;

const statusOrder = {
  [TASK_STATUS.TO_DO]: 1,
  [TASK_STATUS.IN_PROGRESS]: 2,
  [TASK_STATUS.COMPLETED]: 3,
} as const;

export const TaskProvider = ({children}: {children: React.ReactNode}) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [headerColumns, setHeaderColumns] = useState<ITaskHeader[]>([
    {id: '1', name: 'Title'},
    {id: '2', name: 'Due Date'},
    {id: '3', name: 'Priority'},
    {id: '4', name: 'Status'},
  ]);

  const filterTasks = ({
    status,
    priority,
    dueDateRange,
  }: {
    status: string;
    priority: string;
    dueDateRange: number;
  }) => {
    let filteredTasks = [...tasks];
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (dueDateRange) {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + dueDateRange);

      filteredTasks = filteredTasks.filter(task => {
        const taskDueDate = new Date(task.dueDate);
        return taskDueDate >= today && taskDueDate <= endDate;
      });
    }
    setFilteredTasks(filteredTasks);
  };

  const sortTasks = (sortBy: 'dueDate' | 'priority' | 'status') => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'status') {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
    setFilteredTasks(sortedTasks);
  };

  const updateTask = (newTask: ITask) => {
    setFilteredTasks(prevState => {
      const lookupIndex = prevState.findIndex(t => t.id === newTask.id);
      if (lookupIndex === -1) {
        console.log('Cannot find task');
        return prevState;
      }
      return [
        ...prevState.slice(0, lookupIndex),
        newTask,
        ...prevState.slice(lookupIndex + 1),
      ];
    });
  };

  const updateTaskImage = (
    taskId: ITask['id'],
    imageUrls: string | string[],
  ) => {
    setFilteredTasks(prevState => {
      const lookupIndex = prevState.findIndex(t => t.id === taskId);
      if (lookupIndex === -1) {
        console.log('Cannot find task');
        return prevState;
      }
      const updatedTasks = [...prevState];

      const updatedTask = {...updatedTasks[lookupIndex]};

      if (!updatedTask.attachedImages) {
        updatedTask.attachedImages = [];
      }

      if (Array.isArray(imageUrls)) {
        updatedTask.attachedImages = [
          ...updatedTask.attachedImages,
          ...imageUrls,
        ];
      } else {
        updatedTask.attachedImages = [...updatedTask.attachedImages, imageUrls];
      }

      updatedTasks[lookupIndex] = updatedTask;

      return updatedTasks;
    });
  };

  const resetFilterAndSort = () => {
    setFilteredTasks(tasks);
  };

  useEffect(() => {
    const initialTasks = generateTasks(20);
    setTasks(initialTasks);
    setFilteredTasks(initialTasks);
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        setTasks,
        filterTasks,
        headerColumns,
        setHeaderColumns,
        sortTasks,
        updateTask,
        updateTaskImage,
        resetFilterAndSort,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
