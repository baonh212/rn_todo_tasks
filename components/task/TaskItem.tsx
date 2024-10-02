import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ITask, ITaskHeader} from '@/types';
import {DATE_FORMAT_STR} from '@/constants';
import {formatDate} from '@/utils';

const TaskColumn = memo<{value: string; column: string}>(
  ({value}) => {
    return <Text style={styles.column}>{value}</Text>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.column === nextProps.column &&
      prevProps.value === nextProps.value
    );
  },
);

interface ITaskItem {
  headerColumns: ITaskHeader[];
  item: ITask;
  onPress: (task: ITask) => void;
}

export const TaskItem = memo<ITaskItem>(
  ({headerColumns, item, onPress}) => {
    return (
      <TouchableOpacity
        style={styles.taskRow}
        onPress={() => {
          onPress(item);
        }}>
        {headerColumns.map(column => {
          return (
            <TaskColumn
              key={column.id}
              column={column.name}
              value={
                column.name === 'Title'
                  ? item.title
                  : column.name === 'Due Date'
                  ? formatDate(new Date(item.dueDate), DATE_FORMAT_STR.MMddyyyy)
                  : column.name === 'Priority'
                  ? item.priority
                  : item.status
              }
            />
          );
        })}
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.dueDate === nextProps.item.dueDate &&
      prevProps.item.priority === nextProps.item.priority &&
      prevProps.item.status === nextProps.item.status &&
      prevProps.item.attachedImages === nextProps.item.attachedImages &&
      prevProps.headerColumns === nextProps.headerColumns
    );
  },
);

const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
});
