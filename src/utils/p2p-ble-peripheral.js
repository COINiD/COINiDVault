/**
 * Utilities for p2p communication
 */

import blePeripheral from 'react-native-p2p-transfer-ble-peripheral';
import { getServiceUUID, encryptData, decryptData } from './p2p-ble-common';

const sendData = function (data, p2pCode) {
  return new Promise((resolve, reject) => {
    const serviceUUID = getServiceUUID(p2pCode, 'central-receiving-peripheral-sending');
    const localName = 'COINiD';

    let encryptedData = encryptData(data, p2pCode);
    console.log(encryptedData, p2pCode);

    blePeripheral
    .sendData(encryptedData, {serviceUUID, localName})
    .then(() => {
      return resolve();
    })
    .catch(error => reject(error));
  });
}

const getData = function (p2pCode) {
  return new Promise((resolve, reject) => {
    const serviceUUID = getServiceUUID(p2pCode, 'central-sending-peripheral-receiving');
    const localName = 'COINiD';

    const peerConnected = (event) => {
      blePeripheral.removeListener('receivingStarted', peerConnected);
      clearTimeout(timeoutTimer);
    }
    blePeripheral.addListener('receivingStarted', peerConnected);

    const timeout = () => {
      this.stop();
      return reject('No peers found...');
    }
    const timeoutTimer = setTimeout(timeout, 10000);

    blePeripheral
    .receiveData({serviceUUID, localName})
    .then((returnData) => {
      let encryptedData = returnData.value;
      let data = decryptData(encryptedData, p2pCode);

      if(!data) {
        return reject("Error decoding data");
      }
      
      return resolve(data);
    })
    .catch(error => reject(error));
  });
}

export const p2pClient = (p2pCode, {cbConnected, cbReceiveProgress, cbReceiveDone, cbSendProgress, cbSendDone}) => {
  if(cbConnected !== undefined) blePeripheral.addListener('receivingStarted', cbConnected);
  if(cbReceiveProgress !== undefined) blePeripheral.addListener('receivingProgress', cbReceiveProgress);
  if(cbReceiveDone !== undefined) blePeripheral.addListener('receivingDone', cbReceiveDone);
  if(cbSendProgress !== undefined) blePeripheral.addListener('sendingProgress', cbSendProgress);
  if(cbSendDone !== undefined) blePeripheral.addListener('sendingDone', cbSendDone);

  const client = {
    getData: () => getData.bind(client)(p2pCode),
    sendData: (data) => sendData.bind(client)(data, p2pCode),
    stop: () => {
      blePeripheral.unpublish();
      blePeripheral.removeAllListeners('receivingStarted');
      blePeripheral.removeAllListeners('receivingProgress');
      blePeripheral.removeAllListeners('receivingDone');
      blePeripheral.removeAllListeners('sendingProgress');
      blePeripheral.removeAllListeners('sendingDone');
    }
  };

  return client;
}