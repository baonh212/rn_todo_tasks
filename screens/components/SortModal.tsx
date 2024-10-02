import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {TaskContextType} from '@/context/TaskContext';

interface ISortModal extends Pick<TaskContextType, 'sortTasks'> {
  dismissModal: () => void;
}

const SortItem = ({text, onPress}: {text: string} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={styles.sortItemContainer} onPress={onPress}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export const SortModal = ({sortTasks, dismissModal}: ISortModal) => {
  const onSortItemPress = useCallback(
    (sortBy: 'dueDate' | 'priority' | 'status') => {
      dismissModal();
      sortTasks(sortBy);
    },
    [],
  );

  return (
    <View style={styles.container}>
      <SortItem
        text={'Due date'}
        onPress={() => {
          onSortItemPress('dueDate');
        }}
      />
      <SortItem
        text={'Priority'}
        onPress={() => {
          onSortItemPress('priority');
        }}
      />
      <SortItem
        text={'Status'}
        onPress={() => {
          onSortItemPress('status');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sortItemContainer: {
    marginBottom: 20,
  },
});
