import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text } from '..';
import styles from './styles';
import createStyleArr from '../../utils/createStyleArr';

class TxInfoRow extends Component {
  render() {
    const { props, context } = this;
    const themeStyle = styles(context.theme || '');
    const styleArr = createStyleArr(themeStyle.row, props.style);
    const labelStyleArr = createStyleArr(themeStyle.text);

    if (!this.props.dark) {
      labelStyleArr.push(themeStyle.label);
    }

    const trimStrLength = (str) => {
      if (str.length > 26) {
        return `${str.substr(0, 10)}...${str.substr(-13)}`;
      }
      return str;
    };

    return (
      <View {...props} style={styleArr}>
        <Text style={[labelStyleArr, this.props.labelStyle]}>{props.label}</Text>
        <Text
          bold
          style={[themeStyle.text, themeStyle.value]}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {props.children}
        </Text>
      </View>
    );
  }
}

TxInfoRow.contextTypes = {
  theme: PropTypes.string,
};

export default TxInfoRow;
