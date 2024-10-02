import {useNavigation as useReactNativeNavigation} from '@react-navigation/native';
import {RootNavigationProp, RootStackParamList} from '@/navigation/types';

export const useNavigation = <TScreen extends keyof RootStackParamList>() => {
  const navigation = useReactNativeNavigation<RootNavigationProp<TScreen>>();

  return {...navigation};
};
