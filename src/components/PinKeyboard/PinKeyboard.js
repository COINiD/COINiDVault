import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import LottieView from 'lottie-react-native';
import moment from 'moment';

import TouchID from 'react-native-touch-id';
import { Text } from '..';

import styles from './styles';

const lottieFiles = {
  faceid: require('../../animations/faceid.json'),
  pinlock: require('../../animations/pinlock.json'),
};

class PinKeyboard extends PureComponent {
  themeStyle;

  biometryType: false;

  constructor(props): void {
    super(props);

    this.state = {
      bottom: 0,
      value: this.props.value,
      keyboard: null,
      integratedInput: null,
      biometryType: '',
    };
  }

  integratedInput = () => {
    if (this.props.children) {
      return <View style={this.themeStyle.integratedInput}>{this.props.children}</View>;
    }
    return null;
  };

  componentDidMount() {
    this.setState({
      keyboard: this.outputKeyboard(),
    });

    TouchID.isSupported().then(
      (biometryType) => {
        this.biometryType = biometryType;

        this.setState({
          keyboard: this.outputKeyboard(),
          biometryType,
        });
      },
      (error) => {
        console.log(error);
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      keyboard: this.outputKeyboard(),
    });
  }

  startTouchId = () => {
    if (this._shouldShowTouchID()) {
      this.props.onTouchId();
    }
  };

  removeValue = () => {
    if (this.props.value.length - 1 < 0) {
      return;
    }

    this.setValue(this.props.value.slice(0, -1));
  };

  addValue = (value) => {
    if (this.props.value.length + 1 > this.props.maxLength) {
      return;
    }

    this.setValue(this.props.value + value);
  };

  setValue = (value) => {
    this.props.onValueChange(value);
  };

  _shouldShowTouchID = () => this.biometryType && this.props.showTouchId;

  _biometryIcon = () => {
    if (this.biometryType === 'FaceID') {
      return (
        <View style={this.themeStyle.icon}>
          <LottieView
            progress={1}
            source={lottieFiles.faceid}
            style={{
              height: 24,
              width: 24,
            }}
          />
        </View>
      );
    }
    return (
      <Icon
        size={24}
        name="fingerprint"
        iconStyle={[this.themeStyle.keyText, this.themeStyle.TouchID]}
      />
    );
  };

  outputKeyboard = () => {
    const reorder = (a) => {
      const dontTouch = [9, 11];
      var shuffleIt = (a, i) => {
        const j = Math.floor(Math.random() * (i + 1));

        if (dontTouch.indexOf(i) != -1) {
          return a;
        }

        if (dontTouch.indexOf(j) != -1) {
          return shuffleIt(a, i);
        }

        [a[i], a[j]] = [a[j], a[i]];

        return a;
      };

      for (let i = a.length - 1; i > 0; i--) {
        a = shuffleIt(a, i);
      }

      return a;
    };

    const keyItem = (id, label, onPress, style, textStyle) => (
      <TouchableOpacity key={id} onPress={onPress} style={style}>
        {label}
      </TouchableOpacity>
    );

    const emptyKey = () => <Text style={this.themeStyle.key} />;
    const key = k => keyItem(
      k,
      <Text style={this.themeStyle.keyText}>{k}</Text>,
      () => this.addValue(k),
      this.themeStyle.key,
    );
    const backspace = k => keyItem(
      'backspace',
      <Icon name="backspace" style={[this.themeStyle.keyText]} />,
      () => this.removeValue(),
      [this.themeStyle.key, { justifyContent: 'center' }],
    );
    const touchId = (k) => {
      if (this._shouldShowTouchID()) {
        return keyItem(
          'touchId',
          this._biometryIcon(),
          () => this.startTouchId(),
          this.themeStyle.key,
        );
      }

      return emptyKey();
    };

    const keyMap = [
      key('1'),
      key('2'),
      key('3'),
      key('4'),
      key('5'),
      key('6'),
      key('7'),
      key('8'),
      key('9'),
      touchId(),
      key('0'),
      backspace(),
    ];

    // keyMap = reorder(keyMap);

    return (
      <View style={this.themeStyle.keyboard}>
        {keyMap[0]}
        {keyMap[1]}
        {keyMap[2]}
        {keyMap[3]}
        {keyMap[4]}
        {keyMap[5]}
        {keyMap[6]}
        {keyMap[7]}
        {keyMap[8]}
        {keyMap[9]}
        {keyMap[10]}
        {keyMap[11]}
      </View>
    );
  };

  render() {
    const { props, context } = this;
    const { bottom } = this.state;
    const { pinLockoutTime } = props;
    const themeStyle = styles(context.theme || '');
    this.themeStyle = themeStyle;

    const renderKeyboardArea = () => {
      if (pinLockoutTime) {
        return (
          <View style={{ height: 228 + 16, alignItems: 'center', justifyContent: 'center' }}>
            <LottieView
              source={lottieFiles.pinlock}
              style={{
                height: 49,
                width: 49,
                marginBottom: 16,
              }}
            />
            <Text style={themeStyle.disabledPinTitle}>PIN input has been disabled</Text>
            <Text style={themeStyle.disabledPinText}>
              {`try again ${moment.duration(pinLockoutTime).humanize(true)}`}
            </Text>
          </View>
        );
      }

      return this.state.keyboard;
    };

    return (
      <TouchableWithoutFeedback accessible={false}>
        <View style={[themeStyle.container, { bottom, ...ifIphoneX({ paddingBottom: 32 }, {}) }]}>
          {this.integratedInput()}
          {renderKeyboardArea()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

PinKeyboard.defaultProps = {
  maxLength: 6,
  value: '',
  showTouchId: false,
  onTouchId: () => {},
};

export default PinKeyboard;
