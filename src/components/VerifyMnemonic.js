import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Icon } from 'react-native-elements';

import * as Animatable from 'react-native-animatable';
import { Button, Text } from '.';

import { ifSmallDevice, isSmallDevice, ifAndroid } from '../utils/device';
import { colors } from '../config/styling';
import parentStyle from '../screens/styles';

const themeStyle = parentStyle('dark');

const customShake = {
  0: {
    transform: [{ translateX: 0 }],
  },
  0.2: {
    transform: [{ translateX: -10 }],
  },
  0.4: {
    transform: [{ translateX: 10 }],
  },
  0.6: {
    transform: [{ translateX: -10 }],
  },
  0.8: {
    transform: [{ translateX: 10 }],
  },
  1: {
    transform: [{ translateX: 0 }],
  },
};

Animatable.initializeRegistryWithDefinitions({ customShake });

class VerifyMnemonic extends PureComponent {
  static propTypes = {
    stepAfterText: PropTypes.string.isRequired,
    verifyText: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    const { mnemonicArr } = props;
    const controlWords = this._generateRandomNumbersArr(0, mnemonicArr.length - 1, 3).sort(
      (a, b) => a - b,
    );

    this.state = {
      controlWordIndex: 0,
      controlWords,
      mnemonicWord: '',
      inputFocused: false,
      errorText: '',
    };
  }

  _generateRandomNumbersArr = (from, to, count) => {
    const numberArr = [];

    const getRandomNumber = () => from + Math.floor(Math.random() * (to + 1 - from));

    const generate = () => {
      const number = getRandomNumber();

      if (numberArr.indexOf(number) === -1) {
        numberArr.push(number);
      }

      if (numberArr.length < count) {
        generate();
      }
    };

    generate();

    return numberArr;
  };

  _cancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  _success = () => {
    const { onSuccess } = this.props;
    onSuccess();
  };

  _nextWord = () => {
    const { controlWordIndex, controlWords, mnemonicWord } = this.state;
    const { mnemonicArr } = this.props;

    const currentWordIndex = controlWords[controlWordIndex];

    if (mnemonicArr[currentWordIndex] === mnemonicWord) {
      if (controlWordIndex + 1 >= controlWords.length) {
        this._success();
      } else {
        this.setState({
          controlWordIndex: controlWordIndex + 1,
          mnemonicWord: '',
        });
      }
    } else {
      // error
      this.setState(
        {
          errorText: 'Word does not match your phrase!',
        },
        () => {
          this.errorText.customShake(400).then(() => {
            setTimeout(() => {
              try {
                this.errorText.fadeOut(800);
              } catch (err) {}
            }, 100);
          });

          this.textInput.customShake(400).then(() => {
            this.setState({
              mnemonicWord: '',
            });
          }, 200);
        },
      );
    }
  };

  _close = () => {
    const { onClose } = this.props;
    onClose();
  };

  _onFocus = () => {
    this.setState({
      inputFocused: true,
    });
  };

  _onBlur = () => {
    this.setState({
      inputFocused: false,
    });
  };

  render() {
    const { mnemonicArr, verifyText, stepAfterText } = this.props;
    const {
      inputFocused, mnemonicWord, controlWords, controlWordIndex, errorText,
    } = this.state;

    const currentWordIndex = controlWords[controlWordIndex];

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1 }}
        enabled
        {...ifAndroid(
          {},
          {
            behavior: ifSmallDevice('position', 'padding'),
          },
        )}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={themeStyle.container}>
            <View style={themeStyle.topContainer}>
              <Icon
                size={24}
                name="close"
                color={colors.getTheme('dark').text}
                containerStyle={themeStyle.topIcon}
                onPress={this._close}
                underlayColor="transparent"
                hitSlop={{
                  top: 20,
                  bottom: 20,
                  left: 20,
                  right: 20,
                }}
              />
              <Text h2>Verify recovery phrase</Text>
              <Text>{verifyText}</Text>
            </View>
            <View
              style={isSmallDevice() && inputFocused ? themeStyle.flexEnd : themeStyle.spaceBetween}
            >
              <View>
                <Text style={themeStyle.mnemonicCount}>
                  {`Enter word number ${currentWordIndex + 1}`}
                </Text>
                <Animatable.View
                  ref={(c) => {
                    this.textInput = c;
                  }}
                >
                  <TextInput
                    autoCorrect={false}
                    autoComplete="off"
                    autoFocus={false}
                    spellCheck={false}
                    selectionColor="#FFF"
                    maxLength={16}
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={this._nextWord}
                    placeholder="Enter word"
                    style={[
                      themeStyle.wordInput,
                      inputFocused ? themeStyle.inputFocused : themeStyle.inputBlurred,
                    ]}
                    onBlur={this._onBlur}
                    onFocus={this._onFocus}
                    onChangeText={word => this.setState({ mnemonicWord: word })}
                    value={mnemonicWord}
                    underlineColorAndroid="transparent"
                  />
                </Animatable.View>
                <Animatable.Text
                  ref={(c) => {
                    this.errorText = c;
                  }}
                  style={{ fontSize: 16, marginTop: 6 }}
                  useNativeDriver
                >
                  {errorText}
                </Animatable.Text>
              </View>
              <View style={themeStyle.bottomButtons}>
                <Button style={themeStyle.prevNextBtn} onPress={this._cancel}>
                  Go Back
                </Button>
                <Button style={themeStyle.prevNextBtn} onPress={this._nextWord}>
                  {controlWordIndex + 1 >= controlWords.length ? stepAfterText : 'Next Word'}
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
}

export default VerifyMnemonic;
