import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

import { fontSize, fontWeight, colors } from '../config/styling';
import { Text } from '.';

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

const styles = StyleSheet.create({
  containerBase: {
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: colors.anotherGray,
  },
  filledContainer: {
    position: 'absolute',
    left: 0,
    width: 0,
    backgroundColor: colors.green,
  },
  percentText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.black,
  },
  centerInnards: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledPercentText: {
    color: colors.white,
  },
  errorFill: {
    backgroundColor: colors.orange,
  },
});

export default class ProgressBar extends PureComponent {
  static propTypes = {
    percent: PropTypes.number.isRequired,
    customStatus: PropTypes.string,
  };

  static defaultProps = {
    customStatus: '',
  };

  state = {
    containerWidth: 0,
    error: false,
  };

  _onLayout = ({ nativeEvent: { layout } }) => {
    const { width } = layout;
    this.setState({ containerWidth: width });
  };

  _wrongPassword = () => {
    this.setState({ error: true });
    this.errorText.customShake(600);
  };

  render() {
    const { percent, customStatus } = this.props;
    const { containerWidth, error } = this.state;

    const displayPercent = percent.toFixed(0);
    const displayedText = customStatus !== '' ? customStatus : `${displayPercent}%`;

    return (
      <Animatable.View
        style={[styles.containerBase, styles.container, styles.centerInnards]}
        onLayout={this._onLayout}
        ref={(c) => {
          this.errorText = c;
        }}
        useNativeDriver
      >
        <Text style={styles.percentText}>{displayedText}</Text>

        <View
          style={[
            styles.containerBase,
            styles.filledContainer,
            error ? styles.errorFill : null,
            { width: `${percent}%` },
          ]}
        >
          <View style={[styles.containerBase, styles.centerInnards, { width: containerWidth }]}>
            <Text style={[styles.percentText, styles.filledPercentText]}>{displayedText}</Text>
          </View>
        </View>
      </Animatable.View>
    );
  }
}
