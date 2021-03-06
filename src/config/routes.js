/* eslint-disable react/prop-types */
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
  QRSweeper,
  Reset,
} from '../screens';

export const HomeStack = createStackNavigator(
  {
    Main: { screen: Main },
    Create: { screen: Create },
    Recover: { screen: Recover },
    Settings: { screen: Settings },
    Backup: { screen: Backup },
    Reset: { screen: Reset },
    Sign: { screen: Sign },
    QRSweeper: { screen: QRSweeper },
    UpdatePIN: { screen: UpdatePIN },
    QRDataReceiver: { screen: QRDataReceiver },
    QRDataSender: { screen: QRDataSender },
    COINiDtx: { screen: Sign },
    COINiDpub: { screen: Sign },
    COINiDval: { screen: Sign },
    COINiDmsg: { screen: Sign },
    COINiD2fa: { screen: Sign },
    COINiDsah: { screen: Sign },
    COINiDswp: { screen: QRSweeper },
    COINiDswptx: { screen: Sign },
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);
