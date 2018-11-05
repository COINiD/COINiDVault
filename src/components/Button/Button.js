import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import styles from './styles';
import createStyleArr from '../../utils/createStyleArr';
import { colors } from '../../config/styling';
import { Loading, Text } from '../';

class Button extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this._updateOpacity();
  }

  _updateOpacity() {
    if (!this._button) {
      return;
    }

    if (this.props.disabled) {
      this._button.setOpacityTo(0.4, 150);
    } else {
      this._button.setOpacityTo(1, 150);
    }
  }

  render() {
    const {
      text,
      onPress,
      style,
      textStyle,
      children,
      secondary,
      link,
      isLoading,
      isLoadingText,
    } = this.props;
    const themeStyle = styles(this.context.theme || '');

    let styleArr = createStyleArr(themeStyle.button, style);
    let styleTextArr = createStyleArr(themeStyle.buttonText, textStyle);

    if (secondary) {
      styleArr.push(themeStyle.secondary);
      styleTextArr.push(themeStyle.secondaryText);
    }

    if (link) {
      styleArr.push(themeStyle.link);
      if (isLoading) {
        styleTextArr.push(themeStyle.linkTextLoading);
      } else {
        styleTextArr.push(themeStyle.linkText);
      }
    }

    const getContent = () => {
      return (
        <Text button style={styleTextArr}>
          {children}
        </Text>
      );
    };

    const loaderColor = () => {
      if (secondary) {
        return colors.getTheme(this.context.theme).secondaryButtonText;
      } else if (link) {
        return colors.getTheme(this.context.theme).disabled;
      } else {
        return colors.getTheme(this.context.theme).buttonText;
      }
    };

    const getLoader = () => {
      return (
        <Loading
          size={'small'}
          color={loaderColor()}
          postLoaderTextStyle={[styleTextArr, { paddingRight: 10 }]}
          postLoaderText={isLoadingText}
        />
      );
    };

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        ref={btn => {
          this._button = btn;
          this._updateOpacity();
        }}
        disabled={isLoading ? true : false}
        {...this.props}
        style={styleArr}
        onPress={onPress}
      >
        {isLoading ? getLoader() : getContent()}
      </TouchableOpacity>
    );
  }
}

Button.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

Button.defaultProps = {
  text: 'Button Text',
  isLoading: false,
  isLoadingText: '',
  onPress: () => console.log('Button Pressed'),
};

Button.contextTypes = {
  theme: PropTypes.string,
};

export default Button;
