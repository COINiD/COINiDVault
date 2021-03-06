/**
 * Loads and saves Mnemonic using Keychain
 */

import * as Keychain from 'react-native-keychain';
import bip39 from 'react-native-bip39';
import { encrypt, decrypt } from './encrypt';
import { savePin } from './pin';

export const loadMnemonic = (pin) => {
  if (!pin) {
    throw 'No pin entered';
  }

  return Keychain.getGenericPassword('mnemonic.coinid.org').then((credentials) => {
    const encryptedMnemonic = credentials.password;
    const mnemonic = decrypt(encryptedMnemonic, pin);
    return mnemonic;
  });
};

export const hasMnemonic = () => Keychain.getGenericPassword('mnemonic.coinid.org').then((credentials) => {
  if (!credentials.password) {
    throw 'No Mnemonic';
  }
  return true;
});

export const saveMnemonic = (mnemonic, pin) => {
  if (!mnemonic) {
    throw 'No Mnemonic entered';
  }

  if (!pin) {
    throw 'No Pin entered';
  }

  const encryptedMnemonic = encrypt(mnemonic, pin);

  return Promise.all([
    savePin(pin),
    Keychain.setGenericPassword('mnemonic', encryptedMnemonic, 'mnemonic.coinid.org'),
  ]);
};

export const removeMnemonic = async () => {
  await Keychain.resetGenericPassword('mnemonic.coinid.org');
  await Keychain.resetGenericPassword('pin.coinid.org');
  await Keychain.resetGenericPassword('sweepedkeys.coinid.org');
  return true;
};

export const generateMnemonic = () => {
  try {
    return bip39.generateMnemonic(128); // default to 128
  } catch (e) {
    return false;
  }
};

export const validateMnemonic = mnemonic => bip39.validateMnemonic(mnemonic);
