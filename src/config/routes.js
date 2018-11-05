/* eslint-disable react/prop-types */
import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import {
  Main,
  Create,
  Recover,
  Settings,
  Backup,
  Sign,
  UpdatePIN,
  QRDataReceiver,
  QRDataSender,
} from '../screens';

export const HomeStack = createStackNavigator(
  {
    Main: { screen: Main },
    Create: { screen: Create },
    Recover: { screen: Recover },
    Settings: { screen: Settings },
    Backup: { screen: Backup },
    Sign: { screen: Sign },
    UpdatePIN: { screen: UpdatePIN },
    QRDataReceiver: { screen: QRDataReceiver },
    QRDataSender: { screen: QRDataSender },
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);
