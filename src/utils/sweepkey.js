/**
 * Utilities for sweeped keys
 */

import * as Keychain from 'react-native-keychain';
import { encrypt, decrypt } from './encrypt';
import { sweepStoreSecret } from '../config/secrets.js';

export const getSweepedKeysFromStore = async () => {
  try {
    const { password: encryptedSweepKeyData } = await Keychain.getGenericPassword(
      'sweepedkeys.coinid.org',
    );

    if (!encryptedSweepKeyData) {
      return [];
    }

    const decryptedSweepKeyData = decrypt(encryptedSweepKeyData, sweepStoreSecret);
    const storedKeys = JSON.parse(decryptedSweepKeyData);

    return storedKeys;
  } catch (error) {
    console.log(`Error getting sweepkeydata... ${error}`);
  }

  return [];
};

export const findSweepedKeyInStore = async ({
  address,
  decryptedWif,
  encryptedWif,
  password,
  ticker,
}) => {
  const savedKeys = await getSweepedKeysFromStore();

  if (address && ticker) {
    const [foundKey] = savedKeys.filter((e) => {
      if (e.ticker !== ticker) {
        return false;
      }
      const [filteredAddress] = e.addresses.filter(a => a.address === address);
      return !!filteredAddress;
    });

    return foundKey;
  }

  if (decryptedWif && ticker) {
    const [foundKey] = savedKeys.filter(
      e => e.decryptedWif === decryptedWif && e.ticker === ticker,
    );
    return foundKey;
  }

  if (encryptedWif && password && ticker) {
    const [foundKey] = savedKeys.filter(
      e => e.encryptedWif === encryptedWif && e.password === password && e.ticker === ticker,
    );
    return foundKey;
  }

  return false;
};

export const addSweepedKeyToStore = async ({
  ticker,
  decryptedWif,
  encryptedWif,
  addresses,
  compressed,
  password,
}) => {
  const storedKeys = await getSweepedKeysFromStore();

  if (!ticker || !decryptedWif) {
    throw 'Missing required parameters';
  }

  let isUpdated = false;
  const updatedKeys = storedKeys.map((keyObj) => {
    if (keyObj.ticker === ticker && keyObj.decryptedWif === decryptedWif) {
      isUpdated = true;

      return {
        ...keyObj,
        ...(encryptedWif !== undefined ? { encryptedWif } : {}),
        ...(addresses !== undefined ? { addresses } : {}),
        ...(compressed !== undefined ? { compressed } : {}),
        ...(password !== undefined ? { password } : {}),
      };
    }

    return keyObj;
  });

  if (!isUpdated) {
    updatedKeys.push({
      ticker,
      decryptedWif,
      encryptedWif,
      addresses,
      compressed,
      password,
    });
  }

  const decryptedSweepKeyData = JSON.stringify(updatedKeys);
  const encryptedSweepKeyData = encrypt(decryptedSweepKeyData, sweepStoreSecret);

  return Keychain.setGenericPassword(
    'sweepedkeys',
    encryptedSweepKeyData,
    'sweepedkeys.coinid.org',
  );
};
