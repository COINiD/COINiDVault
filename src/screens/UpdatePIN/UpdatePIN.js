import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { Loading, Text, SetPin } from '../../components';

import styles from './styles';

import { loadMnemonic, saveMnemonic } from '../../utils/mnemonic';

class Screen extends Component {
  themeStyle = '';
  theme = '';
  mnemonicArr = [];

  constructor(props): void {
    super(props);

    const { theme, pin } = this.props.navigation.state.params || {};
    this.theme = theme;
    this.themeStyle = styles(theme);

    this.state = {
      isLoading: true,
      mnemonic: '',
    };

    loadMnemonic(pin).then(mnemonic => {
      this.setState({
        isLoading: false,
        mnemonic,
      });
    });
  }

  getChildContext = () => ({ theme: this.theme });

  _pinSuccess = pin => {
    this._saveMnemonic(pin);
  };

  _pinCancel = () => {
    this._goBack();
  };

  _saveMnemonic = pin => {
    saveMnemonic(this.state.mnemonic, pin).then(() => {
      this._goBack();
    });
  };

  _goBack = () => {
    this.props.navigation.goBack();
  };

  render = function() {
    const themeStyle = this.themeStyle;

    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <SetPin
        title={'Update PIN'}
        themeStyle={themeStyle}
        onSuccess={this._pinSuccess}
        onCancel={this._pinCancel}
      />
    );
  };
}

Screen.childContextTypes = {
  theme: PropTypes.string,
};

Screen.propTypes = {
  navigation: PropTypes.object,
};

export default Screen;
