const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

const TASK_STATUS = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

const DATE_FORMAT_STR = {
  MMddyyyy: 'MM/dd/yyyy',
};

export {TASK_PRIORITY, TASK_STATUS, DATE_FORMAT_STR};
