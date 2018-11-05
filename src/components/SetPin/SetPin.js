import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  View,
} from 'react-native';

import * as Animatable from 'react-native-animatable';

import {
  Button,
  Text,
  PinInput,
  KeyboardWrapper,
} from '..';

import { colors } from '../../config/styling';
import styles from './styles';

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

class SetPin extends PureComponent {
  setPin = '';

  themeStyle = '';

  constructor(props): void {
    super(props);

    this.themeStyle = props.themeStyle;

    this.state = {
      pinDiffers: false,
      confirmPIN: false,
      pin: '',
    };
  }

  componentDidMount() {
    this._p2pKeyboard._showKeyboard();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _submitSetPin = (pin) => {
    this.setPin = pin;

    this.setState({
      confirmPIN: true,
      pin: '',
    });
  };

  _submitConfirmPin = (pin) => {
    if (this.setPin !== pin) {
      this.setState({
        pinDiffers: true,
      });

      this.errorText.customShake(400).then(() => {
        setTimeout(() => {
          try {
            this.errorText.fadeOut(800);
          } catch (err) { }
        }, 2000);
      });

      this.refs.pinInput.customShake(400).then(() => {
        this.setState({
          pin: '',
          indicateError: false,
        });
      }, 200);
    } else {
      this.props.onSuccess(this.setPin);
    }
  };

  _cancel = () => {
    this.props.onCancel();
  };

  render() {
    const themeStyle = this.themeStyle;
    const returnFunc = this.state.confirmPIN
      ? this._submitConfirmPin
      : this._submitSetPin;

    const pinChange = (pin) => {
      pin = pin.replace(/\D/g, ''); // remove all non numeric
      this.setState({ pin });

      if (pin.length === 6) {
        this.timer = setTimeout(() => {
          returnFunc(pin);
        }, 200);
      } else {
        this.setState({ pinDiffers: false });
      }
    };

    const showKeyboard = () => {
      this._p2pKeyboard._showKeyboard();
    };

    return [
      <View key={1} style={themeStyle.container}>
        <View style={themeStyle.topContainer}>
          <Button link onPress={this._cancel} style={themeStyle.topButton}>
            Cancel
          </Button>
          <Text h2>{this.props.title}</Text>
          <Text>
            {this.state.confirmPIN ? 'Confirm new PIN' : 'Enter a new PIN'}
          </Text>
          <PinInput
            ref="pinInput"
            value={this.state.pin}
            style={{ marginTop: 72 }}
            onPress={showKeyboard}
          />
          {this.state.pinDiffers ? (
            <Animatable.Text
              ref={c => this.errorText = c}
              useNativeDriver
              style={{ fontSize: 16, marginTop: 6 }}
            >
              PINs are not matching
            </Animatable.Text>
          ) : null}
        </View>
      </View>,
      <KeyboardWrapper
        key={2}
        value={this.state.pin}
        ref={(c) => { this._p2pKeyboard = c; }}
        onValueChange={pinChange}
        isLocked
      />,
    ];
  }
}

export default SetPin;
