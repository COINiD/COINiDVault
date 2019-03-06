import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button, Text, SetPin } from '../../components';

import styles from './styles';
import { colors } from '../../config/styling';

import { generateMnemonic, saveMnemonic } from '../../utils/mnemonic';

class Screen extends Component {
  themeStyle = '';

  theme = '';

  mnemonicArr = [];

  constructor(props) {
    super(props);

    const { theme } = this.props.navigation.state.params || {};
    this.theme = theme;
    this.themeStyle = styles(theme);

    this.state = {
      mnemonicCount: 0,
      mnemonicWord: '',
      mnemonic: '',
      setPin: false,
    };

    generateMnemonic().then((mnemonic) => {
      this.mnemonicArr = mnemonic.split(' ');

      this.setState({
        mnemonic,
        mnemonicCount: 0,
        mnemonicWord: this.mnemonicArr[0],
        setPin: false,
      });
    });
  }

  getChildContext = () => ({ theme: this.theme });

  prevWord = () => {
    const i = this.state.mnemonicCount - 1;

    if (i >= 0) {
      this.setState({
        mnemonicCount: i,
        mnemonicWord: this.mnemonicArr[i],
      });
    }
  };

  nextWord = () => {
    const i = this.state.mnemonicCount + 1;

    if (i < this.mnemonicArr.length) {
      this.setState({
        mnemonicCount: i,
        mnemonicWord: this.mnemonicArr[i],
      });
    } else {
      // go to set pin instead!
      this.setState({
        setPin: true,
      });
    }
  };

  saveMnemonic = (pin) => {
    const mnemonic = this.mnemonicArr
      .join(' ')
      .trim()
      .toLowerCase();

    saveMnemonic(mnemonic, pin).then(() => {
      this._return();
    });
  };

  pinSuccess = (pin) => {
    this.saveMnemonic(pin);
  };

  pinCancel = () => {
    this.setState({
      setPin: false,
    });
  };

  _return = () => {
    this.props.navigation.state.params.onReady();
    this.props.navigation.goBack();
  };

  render() {
    const themeStyle = this.themeStyle;

    if (this.state.setPin) {
      return (
        <SetPin
          title="Create COINiD Vault"
          themeStyle={themeStyle}
          onSuccess={this.pinSuccess}
          onCancel={this.pinCancel}
        />
      );
    }

    return (
      <View style={themeStyle.container}>
        <View style={themeStyle.topContainer}>
          <Icon
            size={24}
            name="close"
            color={colors.getTheme().text}
            containerStyle={themeStyle.topIcon}
            onPress={this._return.bind(this)}
            underlayColor="transparent"
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
          />
          <Text h2>Create COINiD Vault</Text>
          <Text>
            Write down the following 12 word recovery phrase exactly as they appear and in this
            order.
          </Text>
          <Text style={themeStyle.mnemonicCount}>
            {this.state.mnemonicCount + 1}
            {' '}
of
            {this.mnemonicArr.length}
          </Text>
          <Text h1 style={themeStyle.mnemonicWord}>
            {this.state.mnemonicWord}
          </Text>
        </View>
        <View
          style={[
            themeStyle.bottomContainer,
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: -10,
            },
          ]}
        >
          <Button
            disabled={this.state.mnemonicCount == 0}
            style={themeStyle.wordButton}
            onPress={this.prevWord}
          >
            Prev Word
          </Button>
          <Button style={themeStyle.wordButton} onPress={this.nextWord}>
            {this.state.mnemonicCount == this.mnemonicArr.length - 1 ? 'Set PIN' : 'Next Word'}
          </Button>
        </View>
      </View>
    );
  }
}

Screen.childContextTypes = {
  theme: PropTypes.string,
};

Screen.propTypes = {
  navigation: PropTypes.object,
};

export default Screen;
