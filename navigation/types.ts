import {RouteKey} from './RouteKey';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {ITask} from '@/types';

export type RootStackParamList = {
  [RouteKey.TaskScreen]: undefined;
  [RouteKey.TaskDetailScreen]: {task: ITask};
};

export type RootNavigationProp<TScreen extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, TScreen>;
export type RootRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
