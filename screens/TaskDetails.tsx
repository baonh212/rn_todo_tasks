import React, {useCallback, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Row, TextInput} from '@/components';
import {formatDate} from '@/utils';
import {DATE_FORMAT_STR, TASK_PRIORITY, TASK_STATUS} from '@/constants';
import {useTasks} from '@/context/TaskContext';
import {ITask} from '@/types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {RouteKey} from '@/navigation/RouteKey';
import * as ImagePicker from 'expo-image-picker';
import {CameraType, CameraView, useCameraPermissions} from 'expo-camera';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function TaskDetails() {
  const {updateTask, updateTaskImage} = useTasks();
  const route = useRoute<RouteKey.TaskDetailScreen>();
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();

  const task = route.params.task;

  const [taskDetails, setTaskDetails] = useState<Partial<ITask>>(task);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  const cameraRef = useRef<CameraView>(null);

  const onUpdateTask = useCallback(() => {
    updateTask(taskDetails as ITask);
    navigation.goBack();
  }, [taskDetails]);

  const onChangeTaskDetails = useCallback(
    (key: keyof ITask, newValue: any) => {
      setTaskDetails(prevState => {
        return {
          ...prevState,
          [key]: newValue,
        };
      });
    },
    [taskDetails],
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = useCallback((date: Date) => {
    onChangeTaskDetails('dueDate', date.toISOString());
    hideDatePicker();
  }, []);

  const pickImageAsync = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.5,
    })

    if (!result.canceled) {
      const imageUrls = result.assets.map(a => a.uri);
      updateTaskImage(taskDetails.id!, imageUrls);
      onChangeTaskDetails('attachedImages', [
        ...(taskDetails.attachedImages ?? []),
        ...imageUrls,
      ]);
    } else {
      alert('You did not select any image.');
    }
  }, [taskDetails.id, taskDetails.attachedImages]);

  const toggleCameraFacing = useCallback(() => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }, []);

  const onTakePicture = useCallback(async () => {
    const res = await cameraRef.current?.takePictureAsync({
      quality: 0.5,
    });

    updateTaskImage(taskDetails.id!, res?.uri ?? '');
    onChangeTaskDetails('attachedImages', [
      ...(taskDetails.attachedImages ?? []),
      res?.uri,
    ]);
    setIsCameraVisible(false);
  }, [taskDetails.id, , taskDetails.attachedImages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text>Title</Text>
          <TextInput
            defaultValue={taskDetails.title}
            onChangeText={text => {
              onChangeTaskDetails('title', text);
            }}
          />
          <Text>Due Date</Text>
          <TouchableOpacity onPress={showDatePicker}>
            <Text>
              {formatDate(
                new Date(taskDetails.dueDate ?? ''),
                DATE_FORMAT_STR.MMddyyyy,
              )}
            </Text>
          </TouchableOpacity>
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
                    onChangeTaskDetails('priority', key);
                  }}>
                  <Text
                    style={{
                      color: taskDetails.priority === key ? 'red' : 'black',
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
                    onChangeTaskDetails('status', key);
                  }}>
                  <Text
                    style={{
                      color: taskDetails.status === key ? 'red' : 'black',
                    }}>
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Row>
          <Text>Images</Text>
          <Row
            style={{
              marginTop: 20,
            }}>
            {taskDetails.attachedImages?.map((uri, index) => {
              return (
                <Image
                  key={uri}
                  source={{
                    uri: uri,
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: index === 0 ? 0 : 20,
                  }}
                />
              );
            })}
          </Row>
        </ScrollView>
        <View>
          <Button
            title={'Take Photo'}
            onPress={() => {
              if (!permission?.granted) {
                requestPermission().then(response => {
                  if (response.granted) {
                    setIsCameraVisible(true);
                  }
                });
                return;
              }
              setIsCameraVisible(true);
            }}
          />
        </View>
        <View
          style={{
            marginVertical: 20,
          }}>
          <Button title={'Upload images'} onPress={pickImageAsync} />
        </View>
        <Button title={'Save'} onPress={onUpdateTask} />
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={
          taskDetails?.dueDate ? new Date(taskDetails?.dueDate) : new Date()
        }
        minimumDate={new Date(taskDetails?.dueDate ?? '')}
      />
      {isCameraVisible && permission && (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={() => {
            console.log('Camera ', 'ready');
          }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.takePictureButton}
              onPress={onTakePicture}
            />
          </View>
        </CameraView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  camera: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 1,
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  takePictureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    marginVertical: 40,
  },
});
