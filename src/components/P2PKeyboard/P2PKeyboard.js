import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Alert, Easing, Animated, View } from 'react-native';
import { Button, Text, PinKeyboard, PinInput } from '../../components';

import styles from './styles';

class P2PKeyboard extends PureComponent {
  themeStyle = '';

  constructor(props): void {
    super(props);
    this.indicatorVisible = false;

    this.state = {
      pin: '',
      opacityAnim: new Animated.Value(0),
    };
  }

  componentDidMount = () => {
    this._animatePinIndicator();
  };

  _animatePinIndicator = () => {
    const to = this.indicatorVisible ? 0 : 1;
    this.indicatorVisible = !this.indicatorVisible;

    Animated.timing(this.state.opacityAnim, {
      toValue: to,
      duration: 300,
      useNativeDriver: true,
      delay: 350,
    }).start(this._animatePinIndicator);
  };

  _validPin = pin => {
    this.props.onValid(pin);
    setTimeout(() => this._pinChange(''), 1200);
  };

  _pinChange = pin => {
    pin = pin.replace(/\D/g, ''); // remove all non numeric
    this.setState({ pin });

    if (pin.length == 6) {
      this._validPin(pin);
    }
  };

  _clear = () => {
    this._pinChange('');
  }

  render = function() {
    let { props, context } = this;
    let themeStyle = styles(context.theme || '');
    this.themeStyle = themeStyle;

    return (
      <PinKeyboard
        {...props}
        onValueChange={this._pinChange}
        value={this.state.pin}
        onTouchId={this._onTouchId}
      >
        <View style={{ flex: 1 }}>
          <Text style={themeStyle.pinInfo}>Enter connecting code</Text>
          <View style={themeStyle.pinCodeWrapper}>
            <Text style={themeStyle.pinCode}>{this.state.pin}</Text>
            <Animated.View
              style={[
                themeStyle.pinIndicator,
                { opacity: this.state.opacityAnim },
              ]}
            />
          </View>
        </View>
      </PinKeyboard>
    );
  };
}

P2PKeyboard.defaultProps = {
  reasonMessage: 'Enter P2P Code',
};

export default P2PKeyboard;
