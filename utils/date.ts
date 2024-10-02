import {format} from 'date-fns';

const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

export {formatDate};
