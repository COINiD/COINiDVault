'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from '../';
import styles from './styles';
import createStyleArr from '../../utils/createStyleArr';
import { View } from 'react-native';

class TxInfoRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, context } = this;
    let themeStyle = styles(context.theme || '');
    let styleArr = createStyleArr(themeStyle.row, props.style);
    let labelStyleArr = createStyleArr(themeStyle.text);

    if (!this.props.dark) {
      labelStyleArr.push(themeStyle.label);
    }

    const trimStrLength = str => {
      if (str.length > 26) {
        return str.substr(0, 10) + '...' + str.substr(-13);
      }
      return str;
    };

    return (
      <View {...props} style={styleArr}>
        <Text style={labelStyleArr}>{props.label}</Text>
        <Text bold style={themeStyle.text}>
          {trimStrLength(props.children)}
        </Text>
      </View>
    );
  }
}

TxInfoRow.contextTypes = {
  theme: PropTypes.string,
};

export default TxInfoRow;
