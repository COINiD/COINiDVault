import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button, Text, SetPin } from '../../components';

import styles from './styles';
import { fontStack, fontWeight, colors } from '../../config/styling';

import { saveMnemonic, validateMnemonic } from '../../utils/mnemonic';
import { ifAndroid, ifSmallDevice, isSmallDevice } from '../../utils/device';

class Screen extends Component {
  themeStyle = '';
  theme = '';
  mnemonicArr = [];

  constructor(props): void {
    super(props);

    const { theme } = this.props.navigation.state.params || {};
    this.theme = theme;
    this.themeStyle = styles(theme);

    this.state = {
      isLoading: false,
      mnemonicCount: 0,
      mnemonicWord: '',
      invalidMnemonic: false,
      setPin: false,
      inputFocused: false,
      inputFocusStyle: this.themeStyle.inputBlurred,
    };
  }

  getChildContext = () => ({ theme: this.theme });

  prevWord = () => {
    var i = this.state.mnemonicCount - 1;
    if (i >= 0) {
      this.setState({
        mnemonicWord: this.mnemonicArr[i],
        mnemonicCount: i,
      });
    }
  };

  nextWord = () => {
    if (!this.state.mnemonicWord) {
      return false;
    }

    this.mnemonicArr[this.state.mnemonicCount] = this.state.mnemonicWord;

    var i = this.state.mnemonicCount + 1;
    if (i < 12) {
      this.setState({
        mnemonicWord: this.mnemonicArr[i] || '',
        mnemonicCount: i,
      });
    } else {
      this.validateMnemonic();
    }
  };

  validateMnemonic = ignoreValidation => {
    var mnemonic = this.mnemonicArr
      .join(' ')
      .trim()
      .toLowerCase();

    if (ignoreValidation || validateMnemonic(mnemonic)) {
      // go to set pin instead!
      this.setState({
        setPin: true,
      });
    } else {
      this.setState({
        invalidMnemonic: true,
      });
    }
  };

  saveMnemonic = pin => {
    var mnemonic = this.mnemonicArr
      .join(' ')
      .trim()
      .toLowerCase();

    saveMnemonic(mnemonic, pin).then(() => {
      this._return();
    });
  };

  pinSuccess = pin => {
    this.saveMnemonic(pin);
  };

  pinCancel = () => {
    this.setState({
      setPin: false,
    });
  };

  takeMeBack = () => {
    this.setState({
      invalidMnemonic: false,
    });
  };

  forceSave = () => {
    this.setState({
      setPin: true,
    });
  };

  _return() {
    this.props.navigation.state.params.onReady();
    this.props.navigation.goBack();
  }

  _onFocus() {
    this.setState({
      inputFocusStyle: this.themeStyle.inputFocused,
      inputFocused: true,
    });
  }

  _onBlur() {
    this.setState({
      inputFocusStyle: this.themeStyle.inputBlurred,
      inputFocused: false,
    });
  }

  _nextDisabled() {
    return (
      this.state.mnemonicWord.length < 1 &&
      !(this.state.mnemonicCount == 12 - 1)
    );
  }

  _prevDisabled() {
    return this.state.mnemonicCount == 0;
  }

  render = function() {
    const { theme } = this.props.navigation.state.params || {};
    const themeStyle = this.themeStyle;
    const {
      inputFocused,
      inputFocusStyle,
      invalidMnemonic,
      mnemonicCount,
      mnemonicWord,
      setPin,
    } = this.state;

    if (setPin) {
      return (
        <SetPin
          title={'Recover COINiD Vault'}
          themeStyle={themeStyle}
          onSuccess={this.pinSuccess}
          onCancel={this.pinCancel}
        />
      );
    }

    if (invalidMnemonic) {
      return (
        <View style={themeStyle.container}>
          <View style={themeStyle.topContainer}>
            <Text h2>Invalid Mnemonic</Text>
            <Text>
              The phrase you have just entered is not something that have been
              generated with this app. Are you sure you wish to recover it?
            </Text>
          </View>
          <View style={[themeStyle.bottomContainer]}>
            <Button onPress={this.takeMeBack}>No, take me back!</Button>
            <Button secondary onPress={this.forceSave}>
              Yes, I’m sure!
            </Button>
          </View>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        enabled
        {...ifAndroid(
          {},
          {
            behavior: ifSmallDevice('position', 'height'),
          }
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={themeStyle.container}>
            <View style={themeStyle.topContainer}>
              <Icon
                size={24}
                name="close"
                color={colors.getTheme().text}
                containerStyle={themeStyle.topIcon}
                onPress={this._return.bind(this)}
                underlayColor="transparent"
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              />
              <Text h2>Recover COINiD Vault</Text>
              <Text>Enter the 12 word recovery phrase.</Text>
            </View>
            <View
              style={
                isSmallDevice() && inputFocused
                  ? themeStyle.flexEnd
                  : themeStyle.spaceBetween
              }
            >
              <View>
                <Text style={themeStyle.mnemonicCount}>
                  {mnemonicCount + 1} of 12
                </Text>
                <TextInput
                  autoCorrect={false}
                  autoFocus={false}
                  selectionColor={'#FFF'}
                  maxLength={16}
                  autoCapitalize={'none'}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={this.nextWord}
                  placeholder={'Enter word'}
                  style={[themeStyle.wordInput, inputFocusStyle]}
                  onBlur={() => this._onBlur()}
                  onFocus={() => this._onFocus()}
                  onChangeText={word => this.setState({ mnemonicWord: word })}
                  value={mnemonicWord}
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={themeStyle.bottomButtons}>
                <Button
                  disabled={this._prevDisabled()}
                  style={themeStyle.prevNextBtn}
                  onPress={this.prevWord}
                >
                  Prev Word
                </Button>
                <Button
                  disabled={this._nextDisabled()}
                  style={themeStyle.prevNextBtn}
                  onPress={this.nextWord}
                >
                  {mnemonicCount == 12 - 1 ? 'Save' : 'Next Word'}
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
