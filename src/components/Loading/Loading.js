import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
import { Text } from '../../components';

const Loading = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      {props.postLoaderText ? (
        <Text button style={props.postLoaderTextStyle}>
          {props.postLoaderText}
        </Text>
      ) : null}

      <ActivityIndicator animating {...props} />
    </View>
  );
};

Loading.propTypes = {
  size: PropTypes.string,
};

Loading.defaultProps = {
  size: 'large',
  containerStyle: {},
  postLoaderText: '',
  postLoaderTextStyle: {},
};

export default Loading;
