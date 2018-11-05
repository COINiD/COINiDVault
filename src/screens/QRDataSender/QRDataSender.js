import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';

import QRDataTransferSender from 'react-native-qr-data-transfer-sender';

import { Button, Text } from '../../components';
import { colors } from '../../config/styling';
import styles from './styles';

class QRDataSender extends PureComponent {
  themeStyle = '';

  theme = '';

  constructor(props) {
    super(props);

    const { navigation: { state: { params: { data, theme } } } } = this.props;
    this.theme = theme;
    this.themeStyle = styles(theme);

    this.state = {
      data,
      qrWidth: 0,
    };
  }

  getChildContext = () => ({ theme: this.theme });

  _goBack = () => {
    const { navigation: { goBack } } = this.props;
    goBack();
  };

  _onLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    let maxWidth = width;

    if (height - 24 < width) {
      maxWidth = height - 24;
    }

    this.setState({ qrWidth: maxWidth - 19 * 2 });
  };

  render() {
    const { data, qrWidth } = this.state;
    const { themeStyle, theme } = this;

    const renderBox = ({ blockIndex, index, length }) => {
      const blockStyle = [themeStyle.block];

      if (blockIndex === index) {
        blockStyle.push(themeStyle.activeBlock);
      }

      if (length > 13) {
        blockStyle.push(themeStyle.noBlockMargin);
      }

      return (<View key={`box-${blockIndex}`} style={blockStyle} />);
    };

    const renderQr = () => {
      if (qrWidth === 0) {
        return null;
      }

      return (
        <QRDataTransferSender
          containerStyle={{ padding: 19, backgroundColor: '#FFFFFF', alignItems: 'center' }}
          data={data}
          itemContainerStyle={themeStyle.blockContainer}
          renderCurrentItem={({ index, length }) => {
            if (length === 1) {
              return null;
            }

            const boxes = Array(length)
              .fill()
              .map((e, blockIndex) => renderBox({ blockIndex, index, length }));
            return boxes;
          }}
          ecl="L"
          qrWidth={qrWidth}
        />
      );
    };

    return (
      <View style={themeStyle.container}>
        <View>
          <Icon
            size={24}
            name="close"
            color={colors.getTheme(theme).text}
            containerStyle={themeStyle.topIcon}
            onPress={this._goBack}
            underlayColor="transparent"
            hitSlop={{
              top: 20, bottom: 20, left: 20, right: 20,
            }}
          />
          <Text h2>Scan with COINiD Wallet</Text>
          <Text>Press done on the COINiD Wallet and scan this code.</Text>
        </View>
        <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }]} onLayout={this._onLayout}>
          {renderQr()}
        </View>
        <Button style={{ marginTop: 24 }} onPress={this._goBack}>
          Done
        </Button>
      </View>
    );
  }
}

QRDataSender.childContextTypes = {
  theme: PropTypes.string,
};

QRDataSender.propTypes = {
  navigation: PropTypes.object,
};

export default QRDataSender;
