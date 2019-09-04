import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import VerifyMnemonic from '../../components/VerifyMnemonic';
import { removeMnemonic, loadMnemonic } from '../../utils/mnemonic';

class Screen extends Component {
  theme = '';

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const { theme } = navigation.state.params || {};

    this.theme = theme;

    this.state = {
      mnemonicArr: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const { pin } = navigation.state.params || {};

    loadMnemonic(pin).then((mnemonic) => {
      this.setState({
        mnemonicArr: mnemonic.split(' '),
      });
    });
  }

  getChildContext = () => ({ theme: this.theme });

  _verifySuccess = () => {
    this._resetWallet();
  };

  _verifyCancel = () => {
    this._return();
  };

  _return = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  _resetWalletConfirmed = () => {
    const { navigation } = this.props;
    removeMnemonic().then(() => {
      navigation.state.params.onReady();

      const resetAction = StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName: 'Main' })],
      });

      navigation.dispatch(resetAction);
    });
  };

  _resetWallet = () => {
    Alert.alert(
      'Are you sure?',
      'This will delete the stored mnemonic, make sure you have a backup...',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'OK', onPress: () => this._resetWalletConfirmed() },
      ],
      { cancelable: true },
    );
  };

  render() {
    const { mnemonicArr } = this.state;

    if (mnemonicArr.length === 0) {
      return null;
    }

    return (
      <VerifyMnemonic
        mnemonicArr={mnemonicArr}
        onSuccess={this._verifySuccess}
        onCancel={this._verifyCancel}
        onClose={this._return}
        stepAfterText="Reset Wallet"
        verifyText="To reset enter the following words from the recovery phrase."
      />
    );
  }
}

Screen.childContextTypes = {
  theme: PropTypes.string,
};

Screen.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
};

export default Screen;
