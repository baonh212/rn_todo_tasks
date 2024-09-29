import {RouteKey} from './RouteKey';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  [RouteKey.TaskScreen]: undefined;
  [RouteKey.TaskDetailScreen]: undefined;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList>;
export type RootRouteProp = RouteProp<RootStackParamList>;
