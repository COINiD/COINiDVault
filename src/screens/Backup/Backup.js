import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import { Button, Loading, Text } from '../../components';

import styles from './styles';

import { loadMnemonic } from '../../utils/mnemonic';

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
      mnemonicCount: 0,
      mnemonicWord: this.mnemonicArr[0],
      mnemonic: '',
    };

    loadMnemonic(pin).then(mnemonic => {
      this.mnemonicArr = mnemonic.split(' ');

      this.setState({
        isLoading: false,
        mnemonic: mnemonic,
        mnemonicCount: 0,
        mnemonicWord: this.mnemonicArr[0],
      });
    });
  }

  getChildContext = () => ({ theme: this.theme });

  prevWord = () => {
    var i = this.state.mnemonicCount - 1;

    if (i >= 0) {
      this.setState({
        mnemonicCount: i,
        mnemonicWord: this.mnemonicArr[i],
      });
    }
  };

  nextWord = () => {
    var i = this.state.mnemonicCount + 1;

    if (i < this.mnemonicArr.length) {
      this.setState({
        mnemonicCount: i,
        mnemonicWord: this.mnemonicArr[i],
      });
    } else {
      this.props.navigation.goBack();
    }
  };

  render = function() {
    const themeStyle = this.themeStyle;

    if (this.state.isLoading) {
      return <Loading />;
    }

    return (
      <View style={themeStyle.container}>
        <View style={themeStyle.topContainer}>
          <Text h2>Backup</Text>
          <Text>
            Write down the following 12 word recovery phrase exactly as they
            appear and in this order
          </Text>
          <Text style={themeStyle.mnemonicWord}>{this.state.mnemonicWord}</Text>
          <Text style={themeStyle.mnemonicCount}>
            {this.state.mnemonicCount + 1} of {this.mnemonicArr.length}
          </Text>
        </View>
        <View style={[themeStyle.bottomContainer, themeStyle.bottomButtons]}>
          <Button
            disabled={this.state.mnemonicCount == 0 ? true : false}
            style={themeStyle.prevNextBtn}
            onPress={this.prevWord}
          >
            Prev Word
          </Button>
          <Button style={themeStyle.prevNextBtn} onPress={this.nextWord}>
            {this.state.mnemonicCount == this.mnemonicArr.length - 1
              ? 'Got it!'
              : 'Next Word'}
          </Button>
        </View>
      </View>
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
