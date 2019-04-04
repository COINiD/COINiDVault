import React, { Component } from 'react';
import { StatusBar, Platform } from 'react-native';
import { HomeStack } from './config/routes';

export default class COINiD extends Component {
  constructor(props): void {
    super(props);

    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
    if(Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
    }
  }

  render() {
    return <HomeStack />;
  }
}