import React, {PropsWithChildren} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

export const Row = ({
  children,
  style,
  ...rest
}: PropsWithChildren<ViewProps>) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
