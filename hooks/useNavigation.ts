import {useNavigation as useReactNativeNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '@/navigation/types';

export const useNavigation = () => {
  const navigation = useReactNativeNavigation<RootNavigationProp>();

  return {...navigation};
};
