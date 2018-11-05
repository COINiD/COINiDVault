'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import styles from './styles';
import createStyleArr from '../../utils/createStyleArr';

class AppText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { props, context } = this;
    let themeStyle = styles(context.theme || '');
    let styleArr = createStyleArr(themeStyle.text);

    if (props.h1) {
      styleArr.push(themeStyle.h1);
    }

    if (props.h2) {
      styleArr.push(themeStyle.h2);
    }

    if (props.h3) {
      styleArr.push(themeStyle.h3);
    }

    if (props.p) {
      styleArr.push(themeStyle.p);
    }

    if (props.button) {
      styleArr.push(themeStyle.button);
    }

    if (props.bold) {
      styleArr.push(themeStyle.weightBold);
    }

    if (props.medium) {
      styleArr.push(themeStyle.weightMedium);
    }

    if (Array.isArray(props.style)) {
      styleArr = styleArr.concat(props.style);
    } else {
      styleArr.push(props.style);
    }

    return (
      <Text {...props} style={styleArr}>
        {props.children}
      </Text>
    );
  }
}

AppText.contextTypes = {
  theme: PropTypes.string,
};

export default AppText;
