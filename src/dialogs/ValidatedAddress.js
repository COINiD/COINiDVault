import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { fontSize, fontWeight, colors } from '../config/styling';
import { DetailsModal, Text, Button } from '../components';

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  address: {
    fontSize: fontSize.tiny,
    fontWeight: fontWeight.medium,
    marginBottom: 16,
    textAlign: 'center',
  },
  instructions: {
    fontSize: fontSize.smallest,
    fontWeight: fontWeight.normal,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
    height: 48,
  },
});

const ValidatedAddress = ({ onClosed, address }) => {
  const modalRef = useRef();

  useLayoutEffect(() => {
    modalRef.current._open();
  }, []);

  return (
    <DetailsModal title="Derived address" onClosed={onClosed} ref={modalRef}>
      <View style={styles.modalContent}>
        <Text style={styles.address} selectable>
          {address}
        </Text>
        <Text style={styles.instructions}>
          Please do a manual verification that this is the same address that is showing in your
          COINiD Wallet before you use it.
        </Text>
        <Button style={styles.button} onPress={onClosed}>
          Done
        </Button>
      </View>
    </DetailsModal>
  );
};

export default ValidatedAddress;
