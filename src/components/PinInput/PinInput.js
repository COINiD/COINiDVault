import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View, TouchableWithoutFeedback } from 'react-native';

import * as Animatable from 'react-native-animatable';
import styles from './styles';

class PinInput extends PureComponent {
  render() {
    const { props, context } = this;
    const themeStyle = styles(context.theme || '');

    const getPins = (numPins) => {
      const pinArr = [];

      for (let i = 0; i < numPins; i += 1) {
        const pinStyle = [themeStyle.pin];

        if (props.value.length > i) {
          pinStyle.push(themeStyle.filled);
          pinStyle.push(props.filledStyle);
        }

        pinStyle.push(props.pinStyle);

        pinArr.push(<View key={`pin${i}`} style={pinStyle} />);
      }

      return pinArr;
    };

    return (
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={[themeStyle.container, props.style]}>{getPins(props.numPins)}</View>
      </TouchableWithoutFeedback>
    );
  }
}

PinInput.defaultProps = {
  value: '',
  numPins: 6,
  onPress: () => {},
};

const AnimatablePinInput = Animatable.createAnimatableComponent(PinInput);

export default AnimatablePinInput;
