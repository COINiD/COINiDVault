import React, {
  useContext, useCallback, useState, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Animated, StyleSheet, Easing, View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const CustomOverlayContext = React.createContext({});

export const CustomOverlayContextProvider = ({ children }) => {
  const [content, setContent] = useState(null);

  const anim = useRef(new Animated.Value(0)).current;

  const animStyle = useRef({
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  }).current;

  const show = useCallback(
    (newContent) => {
      setContent(newContent);
      anim.setValue(0);

      Animated.timing(anim, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    },
    [anim],
  );

  const hide = useCallback(() => {
    anim.setValue(1);

    Animated.timing(anim, {
      toValue: 0,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setContent(null);
    });
  }, [anim]);

  const contextValue = useMemo(
    () => ({
      show,
      hide,
    }),
    [show, hide],
  );

  const renderContent = () => {
    if (!content) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, animStyle]}>
        <View style={styles.innerContainer}>{content}</View>
      </Animated.View>
    );
  };

  return (
    <CustomOverlayContext.Provider value={contextValue}>
      {children}
      {renderContent()}
    </CustomOverlayContext.Provider>
  );
};

CustomOverlayContextProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

CustomOverlayContextProvider.defaultProps = {
  children: null,
};

export const useCustomOverlayContext = () => useContext(CustomOverlayContext);
