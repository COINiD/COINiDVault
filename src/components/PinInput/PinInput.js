import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import { View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Button, Text } from '../../components';

import styles from './styles';

import * as Animatable from 'react-native-animatable';

class PinInput extends PureComponent {
  constructor(props): void {
    super(props);
  }

  render() {
    let {props, context} = this;
    let themeStyle = styles(context.theme || '');

    const getPins = (numPins) => {
      var pinArr = [];

      for (var i = 0; i < numPins; i++) {
        var pinStyle = [themeStyle.pin];

        if(props.value.length > i) {
          pinStyle.push(themeStyle.filled);
          pinStyle.push(props.filledStyle);
        }

        pinStyle.push(props.pinStyle);

        pinArr.push(<View key={'pin'+i} style={pinStyle} />)
      }

      return pinArr;
    }

    return (
      <TouchableWithoutFeedback onPress={props.onPress}>
        <View style={[themeStyle.container, props.style]}>
          {getPins(props.numPins)}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

PinInput.defaultProps = {
  value: '',
  numPins: 6,
  onPress: () => {},
};


PinInput = Animatable.createAnimatableComponent(PinInput);


export default PinInput;