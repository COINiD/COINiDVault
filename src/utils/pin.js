/**
 * Utilities for pin
 */

import * as Keychain from 'react-native-keychain';
import { encrypt, decrypt } from './encrypt';
import { pinSecret } from '../config/secrets.js';

const encryptPin = (pin) => {
  return encrypt(pin, pinSecret);
}

export const savePin = (pin) => {
  var encryptedPin = encryptPin(pin);
  return Keychain.setGenericPassword('pin', encryptedPin, 'pin.coinid.org')
}

export const getEncryptedPin = () => {
  return Keychain
  .getGenericPassword('pin.coinid.org')
  .then((credentials) => {
    return credentials.password;
  });
}

export const getPin = () => {
  return getEncryptedPin()
  .then((encryptedPin) => {
    try {
      var decryptedPin = decrypt(encryptedPin, pinSecret);
      return decryptedPin;
    }
    catch(error) {
      console.log('Error decrypting pin...'+error)
    }
  });
}

export const checkPin = (inputPin) => {
  return getPin()
  .then((decryptedPin) => {
    return inputPin === decryptedPin;
  });
}

