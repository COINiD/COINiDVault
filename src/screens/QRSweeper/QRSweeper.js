import React, { PureComponent } from 'react';
import { Text, View, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Icon } from 'react-native-elements';

import { PrivateKeyPassword } from '../../dialogs';

import { decrypt } from '../../utils/encrypt';
import { getCoinIdDataFromUrl } from '../../utils/coinid';

import { sweepEncryptSecret } from '../../config/secrets';
import { addSweepedKeyToStore } from '../../utils/sweepkey';

import styles from './styles';

class QRSweeper extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      cameraType: 'back',
      deactivateCamera: false,
    };
  }

  _onParsed = ({
    addresses, encryptedWif, decryptedWif, compressed, password,
  }) => {
    const {
      navigation: {
        goBack,
        state: {
          params: { onDone, onError, url },
        },
      },
    } = this.props;

    const { coinIdData, variant, returnScheme } = getCoinIdDataFromUrl(url);
    const coinId = require('coinid-private')(coinIdData);
    const { ticker } = coinId.getInfo();

    const returnUrl = coinId.buildReturnUrl({
      data: coinId.getSweepReturnData({ addresses, compressed }),
      returnScheme,
      variant,
    });

    addSweepedKeyToStore({
      encryptedWif,
      decryptedWif,
      addresses,
      compressed,
      password,
      ticker: ticker.toLowerCase(),
    });

    goBack();
    setTimeout(() => onDone({ variant, returnUrl }), 400);
  };

  _passwordModalClosed = () => {
    this.setState({
      deactivateCamera: false,
    });
  };

  _reactivateScanner = () => {
    setTimeout(() => {
      if (this.scanner) {
        this.scanner.reactivate();
      }
    }, 1000);
  };

  _parseData = (sweepData) => {
    const {
      navigation: {
        state: {
          params: { url },
        },
      },
    } = this.props;
    const { coinIdData } = getCoinIdDataFromUrl(url);
    const coinId = require('coinid-private')(coinIdData);
    const { ticker } = coinId.getInfo();

    coinId
      .parseSweepData(sweepData)
      .then(({
        addresses, encryptedWif, decryptedWif, compressed, password, params: { hint },
      }) => {
        this.setState({
          deactivateCamera: true,
        });

        if (!decryptedWif && encryptedWif) {
          // Open input password dialog with encryptedWif as input.
          this.refPasswordModal._open({
            sweepData,
            hint,
            parseSweepData: coinId.parseSweepData,
            onParsedCb: this._onParsed,
            ticker,
          });
        }

        if (decryptedWif && addresses.length) {
          this._onParsed({
            addresses,
            encryptedWif,
            decryptedWif,
            compressed,
            password,
          });
        }
      })
      .catch((err) => {
        // show warning but continue scanning reactivate.
        Alert.alert('Not valid Private Key', `${err}`);
        this._reactivateScanner();
      });
  };

  _onRead = ({ data }) => {
    const [cleanData] = data.match(/\S{1,}/) || [];
    const [, encrypted] = cleanData.match(/COINIDSWP:\/\/(.{1,})/i) || [];

    if (encrypted) {
      const decrypted = decrypt(encrypted.toLowerCase(), sweepEncryptSecret, 'hex');
      this._parseData(decrypted);
    } else {
      this._parseData(cleanData);
    }
  };

  _goBack = () => {
    const {
      navigation: { goBack },
    } = this.props;
    goBack();
  };

  _flipCamera = () => {
    const { cameraType } = this.state;
    this.setState({
      cameraType: cameraType === 'back' ? 'front' : 'back',
    });
  };

  _renderCustomMarker = () => (
    <View style={[styles.markerContainer, styles.boxShadow]}>
      <View style={[styles.markerCorner, styles.markerTopLeft, styles.boxShadow]} />
      <View style={[styles.markerCorner, styles.markerTopRight, styles.boxShadow]} />
      <View style={[styles.markerCorner, styles.markerBottomLeft, styles.boxShadow]} />
      <View style={[styles.markerCorner, styles.markerBottomRight, styles.boxShadow]} />
    </View>
  );

  render() {
    const { cameraType, deactivateCamera } = this.state;

    const renderCamera = () => {
      if (deactivateCamera) {
        return <View style={styles.containerWrapper} />;
      }

      return (
        <QRCodeScanner
          ref={(node) => {
            this.scanner = node;
          }}
          cameraType={cameraType}
          onRead={this._onRead}
          containerStyle={styles.containerWrapper}
          cameraStyle={styles.container}
          topViewStyle={styles.topView}
          bottomViewStyle={styles.bottomView}
          customMarker={this._renderCustomMarker()}
          reactivate={false}
          showMarker
          fadeIn
          topContent={(
            <React.Fragment>
              <Icon
                containerStyle={styles.closeIconContainer}
                name="close"
                onPress={this._goBack}
                size={24}
                reverse
              />
              <Text style={[styles.title, styles.textShadow]}>Scan QR Code of Private Key</Text>
            </React.Fragment>
)}
          bottomContent={(
            <Icon
              containerStyle={[styles.iconContainer, { transform: [{ rotate: '90deg' }] }]}
              name="autorenew"
              onPress={this._flipCamera}
              size={32}
              color="white"
              underlayColor="transparent"
            />
)}
        />
      );
    };

    return (
      <React.Fragment>
        {renderCamera()}
        <PrivateKeyPassword
          ref={(e) => {
            this.refPasswordModal = e;
          }}
          onClosed={this._passwordModalClosed}
        />
      </React.Fragment>
    );
  }
}

QRSweeper.propTypes = {};

export default QRSweeper;
