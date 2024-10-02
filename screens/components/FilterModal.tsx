import React, {useState} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {TASK_PRIORITY, TASK_STATUS} from '@/constants';
import {Row, TextInput} from '@/components';
import {TaskContextType} from '@/context/TaskContext';

interface IFilterModal extends Pick<TaskContextType, 'filterTasks'> {
  dismissModal: () => void;
}

export const FilterModal = ({dismissModal, filterTasks}: IFilterModal) => {
  const [selectedPriority, setSelectedPriority] = useState<
    string | undefined
  >();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [dueDateRange, setDueDateRange] = useState<string | undefined>();

  return (
    <KeyboardAvoidingView behavior={'padding'}>
      <ScrollView
        contentContainerStyle={styles.content}
        style={styles.container}>
        <Text>Priority</Text>
        <Row
          style={{
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          {Object.entries(TASK_PRIORITY).map(([key, value]) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedPriority(key);
                }}>
                <Text
                  style={{
                    color: selectedPriority === key ? 'red' : 'black',
                  }}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Row>
        <Text>Status</Text>
        <Row
          style={{
            justifyContent: 'space-between',
            marginVertical: 20,
          }}>
          {Object.entries(TASK_STATUS).map(([key, value]) => {
            return (
              <TouchableOpacity
                key={key}
                onPress={() => {
                  setSelectedStatus(key);
                }}>
                <Text
                  style={{
                    color: selectedStatus === key ? 'red' : 'black',
                  }}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Row>
        <Text>Status</Text>
        <TextInput
          placeholder={'Please input due date range'}
          onChangeText={text => {
            setDueDateRange(text);
          }}
        />
        <Button
          title={'Save'}
          onPress={() => {
            dismissModal();
            filterTasks({
              status: selectedStatus ?? '',
              priority: selectedPriority ?? '',
              dueDateRange: !!dueDateRange ? +dueDateRange : 0,
            });
          }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
});
