import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Animated, Easing, View, TouchableWithoutFeedback } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { PinKeyboard, AuthKeyboard, P2PKeyboard } from '../../components';
import { colors } from '../../config/styling';
import styles from './styles';

class KeyboardWrapper extends PureComponent {
  constructor(props): void {
    super(props);

    this.animating = false;

    this.state = {
      scrimOpacity: new Animated.Value(0),
      bottom: new Animated.Value(props.hiddenBottom),
      showKeyboard: props.showKeyboard,
    };
  }

  componentDidMount() {
    this.state.bottom.setValue(this.props.hiddenBottom);
    //this._updateKeyboard(this.props.showKeyboard, this.props.openOnShow);
  }

  componentWillReceiveProps(nextProps) {
    //this._updateKeyboard(nextProps.showKeyboard, nextProps.openOnShow);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  _updateKeyboard = (visible, open) => {
    if (visible) {
      this._showKeyboard(open);
    } else {
      this._hideKeyboard();
    }
  };

  _hideKeyboard = () => {
    if (this.animatingDown) {
      return false;
    }

    this.animatingDown = true;

    const hideKeyboardState = () => {
      this.animatingDown = false;
      if (!this.animatingUp) {
        this.setState({ showKeyboard: false });
      }
    };

    this._animateScrim(0);

    this._animateKeyboard(
      this.props.hiddenBottom,
      hideKeyboardState.bind(this)
    );
  };

  _showKeyboard = open => {
    if(this._keyboard._clear !== undefined) {
      this._keyboard._clear();
    }

    this.animatingUp = true;
    const onReady = () => {
      this.animatingUp = false;
      if (this.props.showTouchId && open) {
        if(this._keyboard._openTouchId !== undefined) {
          this._keyboard._openTouchId();
        }
      }
    };

    if (this._useScrim(this.props.type)) {
      this._animateScrim(0.6);
    }

    this.setState({ showKeyboard: true });
    this._animateKeyboard(0, onReady.bind(this));
  };

  _animateScrim = to => {
    Animated.timing(this.state.scrimOpacity, {
      toValue: to,
      duration: this.props.animationDuration,
      useNativeDriver: true,
    }).start();
  };

  _animateKeyboard = (bottom, callback) => {
    Animated.timing(this.state.bottom, {
      toValue: bottom,
      easing: Easing.ease,
      duration: this.props.animationDuration,
      useNativeDriver: true,
    }).start(callback);
  };

  _onValid = pin => {
    this.timer = setTimeout(() => {
      this.props.onValid(pin);
      this._hideKeyboard();
    }, 200);
  };

  _useScrim = type => {
    return ['p2p', 'auth'].indexOf(type) > -1;
  };

  render = function() {
    let { props, context, state } = this;
    let { bottom } = state;
    let themeStyle = styles(context.theme || '');

    const getKeyboardView = () => {
      return (
        <View style={{ flex: 1 }}>
          {this._useScrim(props.type) ? getScrim() : null}
          <Animated.View
            style={[
              themeStyle.keyboard,
              {
                transform: [{ translateY: bottom }],
              },
            ]}
          >
            {getKeyboard(props.type)}
          </Animated.View>
        </View>
      );
    };

    const getLockedKeyboardWrapper = () => {
      return getKeyboardView();
    };

    const getKeyboardWrapper = () => {
      return (
        <TouchableWithoutFeedback
          onPress={this._hideKeyboard}
          accessible={false}
        >
          {getKeyboardView()}
        </TouchableWithoutFeedback>
      );
    };

    const getKeyboard = type => {
      switch (props.type) {
        case 'p2p':
          return (
            <P2PKeyboard {...props} onValid={this._onValid} ref={(c) => this._keyboard = c}>
              {null}
            </P2PKeyboard>
          );
        case 'pin':
          return <PinKeyboard {...props} ref={(c) => this._keyboard = c}>{null}</PinKeyboard>;
        case 'auth':
          return (
            <AuthKeyboard
              {...props}
              onValid={this._onValid}
              ref={(c) => this._keyboard = c}
            />
          );
      }
    };

    const getScrim = () => {
      return (
        <Animated.View
          style={[
            themeStyle.container,
            {
              backgroundColor: colors.black,
              opacity: this.state.scrimOpacity,
            },
          ]}
        />
      );
    };

    return (
      <Animated.View
        pointerEvents={this.state.showKeyboard ? 'auto' : 'none'}
        style={[
          themeStyle.container,
          props.isLocked ? themeStyle.lockedContainer : null,
          {
            display: this.state.showKeyboard ? 'flex' : 'none',          },
        ]}
      >
        {this.props.isLocked
          ? getLockedKeyboardWrapper()
          : getKeyboardWrapper()}
      </Animated.View>
    );
  };
}

KeyboardWrapper.defaultProps = {
  type: 'pin',
  showKeyboard: false,
  animationDuration: 200,
  showTouchId: false,
  openOnShow: false,
  isLocked: false,
  ...ifIphoneX({ hiddenBottom: 392 }, { hiddenBottom: 360 }),
};

export default KeyboardWrapper;
