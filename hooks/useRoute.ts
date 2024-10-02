import {useRoute as useReactNativeRout} from '@react-navigation/native';
import { RootRouteProp, RootStackParamList } from '@/navigation/types';

export const useRoute = <TScreen extends keyof RootStackParamList>() => {
  const route = useReactNativeRout<RootRouteProp<TScreen>>();

  return {...route};
};
