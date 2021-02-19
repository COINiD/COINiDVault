import React, { Component } from 'react';
import { StatusBar, Platform } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { HomeStack } from './config/routes';
import { CustomOverlayContextProvider } from './contexts/CustomOverlayContext';

export default class COINiD extends Component {
  constructor(props): void {
    super(props);

    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
    }
  }

  render() {
    return (
      <ActionSheetProvider>
        <CustomOverlayContextProvider>
          <HomeStack />
        </CustomOverlayContextProvider>
      </ActionSheetProvider>
    );
  }
}
