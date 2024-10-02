import 'react-native-gesture-handler';

import RootStack from './navigation';
import {TaskProvider} from '@/context/TaskContext';

export default function App() {
  return (
    <TaskProvider>
      <RootStack />
    </TaskProvider>
  );
}
