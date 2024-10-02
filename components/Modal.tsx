import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Modal as RNModal, ModalProps, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export interface ModalRef {
  present: () => void;
  dismiss: () => void;
}

export const Modal = forwardRef<ModalRef, ModalProps>(
  ({children, ...rest}, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const present = () => {
      setIsModalVisible(true);
    };
    const dismiss = () => {
      setIsModalVisible(false);
    };

    useImperativeHandle(ref, () => ({present, dismiss}));

    return (
      <RNModal visible={isModalVisible} transparent={true} {...rest}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>{children}</SafeAreaView>
        </SafeAreaProvider>
      </RNModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
