import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from '@/navigation/types';
import {RouteKey} from '@/navigation/RouteKey';
import {Task, TaskDetails} from '@/screens';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={RouteKey.TaskScreen}>
        <Stack.Screen name={RouteKey.TaskScreen} component={Task} />
        <Stack.Screen
          name={RouteKey.TaskDetailScreen}
          component={TaskDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
