import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
} from 'react-native';

export const TextInput = ({style, ...rest}: TextInputProps) => {
  return <RNTextInput style={[styles.container, style]} {...rest} />;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    borderWidth: 1,
    borderColor: 'gray',
    height: 44,
    paddingHorizontal: 10,
  },
});
