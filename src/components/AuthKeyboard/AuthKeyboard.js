import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import * as Animatable from 'react-native-animatable';
import TouchID from 'react-native-touch-id';

import { Text, PinKeyboard, PinInput } from '..';
import { checkPin, getPin } from '../../utils/pin';

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

class AuthKeyboard extends PureComponent {
  themeStyle = '';

  constructor(props): void {
    super(props);

    this.lockoutTimeSettings = [1 * 60 * 1000, 5 * 60 * 1000];

    this.pinLockoutCount = 0;

    this.state = {
      pin: '',
      indicateError: false,
      triesLeft: 6,
      pinLockoutTime: 0,
    };
  }

  componentDidMount() {
    this._loadLockoutData();
  }

  componentWillUnmount() {
    this._clearCountdownTimeout();
  }

  _clearCountdownTimeout = () => {
    if (this.countdownTimer !== undefined) {
      clearTimeout(this.countdownTimer);
      this.countdownTimer = undefined;
    }
  };

  _loadLockoutData = () => {
    AsyncStorage.getItem('@AuthKeyboard:lockoutUntil').then((data) => {
      if (data !== null) {
        const lockoutUntil = JSON.parse(data);
        const pinLockoutTime = lockoutUntil - Date.now();

        if (pinLockoutTime > 0) {
          this._startCountdown(pinLockoutTime);
        }
      }
    });

    AsyncStorage.getItem('@AuthKeyboard:pinLockoutCount').then((data) => {
      if (data !== null) {
        const pinLockoutCount = JSON.parse(data);
        this.pinLockoutCount = pinLockoutCount;
      }
    });
  };

  _saveLockoutData = (lockoutUntil, pinLockoutCount) => {
    this.pinLockoutCount = pinLockoutCount;

    AsyncStorage.setItem('@AuthKeyboard:lockoutUntil', JSON.stringify(lockoutUntil));
    AsyncStorage.setItem('@AuthKeyboard:pinLockoutCount', JSON.stringify(pinLockoutCount));
  };

  _countdownTick = () => {
    let { pinLockoutTime } = this.state;
    pinLockoutTime -= 1000;

    this._clearCountdownTimeout();

    if (pinLockoutTime > 0) {
      this.countdownTimer = setTimeout(this._countdownTick, 1000);
    } else {
      pinLockoutTime = 0;
    }

    this.setState({
      pinLockoutTime,
    });
  };

  _startCountdown = (forcePinLockoutTime) => {
    let pinLockoutTime;
    if (forcePinLockoutTime) {
      pinLockoutTime = forcePinLockoutTime;
    } else {
      this.pinLockoutCount += 1;

      if (this.pinLockoutCount > this.lockoutTimeSettings.length) {
        this.pinLockoutCount = this.lockoutTimeSettings.length;
      }

      pinLockoutTime = this.lockoutTimeSettings[this.pinLockoutCount - 1];

      const lockoutUntil = Date.now() + pinLockoutTime;
      this._saveLockoutData(lockoutUntil, this.pinLockoutCount);
    }

    this.setState(
      {
        pinLockoutTime,
      },
      this._countdownTick,
    );
  };

  _validPin = (pin) => {
    this._saveLockoutData(0, 0);

    this.setState({
      triesLeft: 6,
    });

    this.props.onValid(pin);
    setTimeout(() => this._pinChange(''), 800);
  };

  _incorrectPin = () => {
    const triesLeft = this.state.triesLeft - 1;

    if (triesLeft <= 0) {
      this._startCountdown();
    }

    this.setState({
      indicateError: true,
      showError: true,
      triesLeft: triesLeft > 0 ? triesLeft : 0,
    });

    this.errorText.customShake(400).then(() => {
      setTimeout(() => {
        try {
          this.errorText.fadeOut(800);
        } catch (err) {}
      }, 1000);
    });

    this.refs.pinInput.customShake(400).then(() => {
      this._pinChange('');

      this.setState({
        indicateError: false,
      });
    }, 200);
  };

  _pinChange = (pin) => {
    pin = pin.replace(/\D/g, ''); // remove all non numeric
    this.setState({ pin });

    if (pin.length == 6) {
      checkPin(pin).then((valid) => {
        if (valid) {
          this._validPin(pin);
        } else {
          this._incorrectPin();
        }
      });
    }
  };

  _clear = () => {
    this._pinChange('');
  };

  _openTouchId = () => {
    TouchID.isSupported().then((biometryType) => {
      this._onTouchId();
    }, console.log);
  };

  _onTouchId = () => {
    TouchID.authenticate(this.props.reasonMessage)
      .then((success) => {
        // Touch ID ok. Get pin and enter it automatically
        getPin().then((pin) => {
          this._pinChange(pin);
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.name == 'RCTTouchIDNotSupported') {
          // Alert only if touch id is not supported.
          Alert.alert('Touch ID Error', error.message);
        }
      });
  };

  render() {
    const { props, context, state } = this;
    const themeStyle = styles(context.theme || '');
    this.themeStyle = themeStyle;
    const { pinLockoutTime } = state;

    const renderError = () => {
      if (!this.state.showError) {
        return null;
      }

      return (
        <Animatable.Text
          ref={c => (this.errorText = c)}
          useNativeDriver
          style={[themeStyle.message, themeStyle.errorMessage]}
        >
          {`${this.state.triesLeft} tries left`}
        </Animatable.Text>
      );
    };

    const renderMessage = () => {
      if (!props.infoMessage) {
        return null;
      }

      return <Text style={[themeStyle.message, themeStyle.infoMessage]}>{props.infoMessage}</Text>;
    };

    // pinLockoutTime

    const renderInput = () => (
      <React.Fragment>
        {renderMessage()}
        <PinInput
          ref="pinInput"
          value={this.state.pin}
          style={[{ marginBottom: 8 }, props.infoMessage ? null : { marginTop: 8 }]}
          pinStyle={[themeStyle.pinStyle, pinLockoutTime ? themeStyle.disabledPinStyle : null]}
          filledStyle={[
            themeStyle.filledStyle,
            this.state.indicateError ? themeStyle.errorFilledStyle : null,
          ]}
        />

        {renderError()}
      </React.Fragment>
    );

    return (
      <PinKeyboard
        {...props}
        onValueChange={this._pinChange}
        value={this.state.pin}
        onTouchId={this._onTouchId}
        pinLockoutTime={pinLockoutTime}
      >
        {renderInput()}
      </PinKeyboard>
    );
  }
}

AuthKeyboard.defaultProps = {
  reasonMessage: 'Sign',
};

export default AuthKeyboard;
