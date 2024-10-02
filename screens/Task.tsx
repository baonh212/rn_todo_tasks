import React, {useMemo, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTasks} from '@/context/TaskContext';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import {ITask, ITaskHeader} from '@/types';
import {TaskItem} from '@/components/task/TaskItem';
import {useNavigation} from '@/hooks';
import {SortModal} from '@/screens/components/SortModal';
import {FilterModal} from '@/screens/components/FilterModal';
import {Modal, ModalRef, Row} from '@/components';
import {RouteKey} from '@/navigation/RouteKey';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Task() {
  const navigation = useNavigation();
  const {
    filterTasks,
    headerColumns,
    setHeaderColumns,
    filteredTasks,
    sortTasks,
    resetFilterAndSort,
  } = useTasks();

  const [columnWidths, setColumnWidths] = useState({
    Title: SCREEN_WIDTH * 0.25, // 25% of screen width initially
    'Due Date': SCREEN_WIDTH * 0.25,
    Priority: SCREEN_WIDTH * 0.25,
    Status: SCREEN_WIDTH * 0.25,
  });
  const filterModalRef = useRef<ModalRef>(null);
  const sortModalRef = useRef<ModalRef>(null);

  const getWidthBeforeColumn = (
    lookupColumn: string,
    columns: ITaskHeader[],
    widths: Record<string, number>,
  ): number => {
    let totalWidth = 0;

    for (const column of columns) {
      if (column.name === lookupColumn) {
        break;
      }
      totalWidth += widths[column.name];
    }

    return totalWidth;
  };

  const createResizeResponder = useMemo(() => {
    const createHandler = (columnName: string, columnIndex?: number) => {
      let startX = 0;
      let initialWidth = getWidthBeforeColumn(
        columnName,
        headerColumns,
        columnWidths,
      );

      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => false,
        onPanResponderGrant: (evt, gestureState) => {
          startX = gestureState.moveX;
          initialWidth = getWidthBeforeColumn(
            columnName,
            headerColumns,
            columnWidths,
          );
        },
        onPanResponderMove: (evt, gestureState) => {
          const deltaX = gestureState.moveX - startX - initialWidth;
          const newWidth = Math.max(SCREEN_WIDTH * 0.25, deltaX);

          setColumnWidths(prevWidths => ({
            ...prevWidths,
            [columnName]: newWidth,
          }));
        },
      });
    };
    return createHandler;
  }, [columnWidths, headerColumns]);

  const renderHeaderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<ITaskHeader>) => {
    return (
      <>
        <TouchableOpacity
          style={[
            styles.headerColumn,
            {
              width: columnWidths[item.name],
              backgroundColor: isActive ? 'red' : 'gray',
            },
          ]}
          onLongPress={drag}>
          <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
        <View
          style={styles.resizeHandle}
          {...createResizeResponder(item.name, getIndex()).panHandlers} // Attach PanResponder to the resize handle
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Row>
        <Button
          title={'Filter'}
          onPress={() => {
            filterModalRef.current?.present();
          }}
        />
        <Button
          title={'Sort'}
          onPress={() => {
            sortModalRef.current?.present();
          }}
        />
        <Button title={'Reset'} onPress={resetFilterAndSort} />
      </Row>
      <DraggableFlatList<ITaskHeader>
        data={headerColumns}
        renderItem={renderHeaderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        onDragEnd={({data}) => {
          setHeaderColumns(data);
        }}
        style={styles.draggableList}
        showsHorizontalScrollIndicator={false}
      />
      <FlatList<ITask>
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TaskItem
            item={item}
            headerColumns={headerColumns}
            onPress={task => {
              console.log('Task ', task);
              navigation.navigate(RouteKey.TaskDetailScreen, {task});
            }}
          />
        )}
        ListEmptyComponent={<Text>No tasks available</Text>}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={true}
      />
      <Modal ref={filterModalRef}>
        <FilterModal
          filterTasks={filterTasks}
          dismissModal={() => {
            filterModalRef.current?.dismiss();
          }}
        />
      </Modal>
      <Modal ref={sortModalRef}>
        <SortModal
          sortTasks={sortTasks}
          dismissModal={() => {
            sortModalRef.current?.dismiss();
          }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
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
  headerColumn: {
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
  draggableList: {
    marginBottom: 20,
  },
  resizeHandle: {
    width: 5,
    height: '100%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ddd',
  },
  dragHandle: {
    flex: 1,
    justifyContent: 'center',
  },
});
