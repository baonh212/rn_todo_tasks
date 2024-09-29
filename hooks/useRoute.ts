import {useNavigation as useReactNativeNavigation} from '@react-navigation/native';
import {RootRouteProp} from '@/navigation/types';

export const useRoute = () => {
  const route = useReactNativeNavigation<RootRouteProp>();

  return {...route};
};
