import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Alert,
  View,
  Platform,
  ScrollView,
} from 'react-native';

import styles from './styles';
import { fontStack, fontWeight } from '../../config/styling';

import {
  Button,
  Text,
  TxInfoRow,
  KeyboardWrapper,
} from '../../components';

import { loadMnemonic } from '../../utils/mnemonic';
import { getCoinIdDataFromUrl } from '../../utils/coinid';
import { numFormat } from '../../utils/numFormat';
import createStyleArr from '../../utils/createStyleArr';

class Screen extends Component {
  themeStyle = '';

  theme = '';

  url = '';

  constructor(props): void {
    super(props);

    const { navigation: { state: { params: { theme, url } } } } = this.props;
    this.theme = theme;
    this.themeStyle = styles(theme);
    this.url = url;

    this.state = {
      isLoading: false,
      isLoadingText: '',
      openKeyboardOnShow: false,
    };
  }

  componentDidMount() {
    this._loadCOINiD(this.url);
  }

  _loadCOINiD = (url) => {
    const { returnScheme, coinIdData, variant } = getCoinIdDataFromUrl(url);

    const coinId = require('coinid-private')(coinIdData);
    const info = coinId.getInfo();

    const getSchemeOwner = () => {
      switch (returnScheme) {
        case 'coinid-test':
          return 'COINiD TEST';
        case 'coinid-btc':
          return 'Bitcoin Wallet for COINiD';
        case 'coinid-tbtc':
          return 'Testnet Wallet for COINiD';
        case 'coinid-xmy':
          return 'Myriad Wallet for COINiD';
        case 'coinid-grs':
          return 'Groestlcoin Wallet for COINiD';
        default:
          return 'Unknown';
      }
    };

    this.setState({
      isLoading: false,
      returnScheme,
      variant,
      schemeOwner: getSchemeOwner(),
      coinId,
      type: info.type,
    });

    if (info.type === 'val') {
      this.setState({
        isLoadingText: 'Validating',
      });
    }

    if (info.type === 'pub') {
      this.setState({
        isLoadingText: 'Deriving',
      });
    }

    if (info.type === 'tx') {
      const txInfo = coinId.getTxInfo();

      this.setState({
        isLoadingText: 'Signing',
        txOutputs: txInfo.externalOutputs,
        txTo: txInfo.externalOutputs[0].address,
        txAmount: txInfo.externalOutputs[0].amount,
        txFee: txInfo.fee,
        txTotal: txInfo.externalTotal + txInfo.fee,
        txTicker: info.ticker.toUpperCase(),
      });
    }

    if (info.type === 'msg') {
      this.setState({
        msgMessage: info.message,
        isLoadingText: 'Signing',
      });
    }

    if (info.type === '2fa') {
      this.setState({
        msgMessage: info.message,
        isLoadingText: 'Signing',
      });

      setTimeout(() => this._showAuth(true), 400);
    }

    if (info.type === 'sah') {
      this.setState({
        msgMessage: info.message,
        isLoadingText: 'Signing',
      });

      setTimeout(() => this._showAuth(true), 400);
    }
  };

  _showAuth = (openKeyboardOnShow) => {
    this.setState({
      openKeyboardOnShow,
    });

    this._keyboard._showKeyboard();
  };

  _sign = (pin) => {
    const { navigation: { goBack, state: { params: { onSigned, onError } } } } = this.props;

    const {
      coinId, returnScheme, type, variant,
    } = this.state;

    const buildReturnUrl = (data) => {
      const getReturnScheme = () => {
        if (variant.toLowerCase() === 'p2p') {
          return returnScheme.toUpperCase();
        }
        return returnScheme;
      };

      return `${getReturnScheme()}://${type.toUpperCase()}/${data}`;
    };

    this.setState({
      isLoading: true,
    });
    this._keyboard._hideKeyboard();

    loadMnemonic(pin).then((mnemonic) => {
      if (mnemonic) {
        coinId
          .getReturnData(mnemonic)
          .then((data) => {
            let returnUrl = buildReturnUrl(data);

            if (type === 'val') {
              Alert.alert('Validated address', data);
              returnUrl = null; // do not send anything back if validate address
            }

            goBack();
            setTimeout(() => onSigned({ variant, returnUrl }), 400);
          })
          .catch((error) => {
            Alert.alert('Signing error', `${error}`);
            goBack();
            onError(`${error}`);
          });
      }
    });
  };

  getChildContext = () => ({ theme: this.theme });

  render() {
    const { themeStyle } = this;

    const {
      openKeyboardOnShow, txOutputs, txTicker, type, schemeOwner, txFee, txTotal, msgMessage, isLoading, isLoadingText,
    } = this.state;

    const getOutputs = () => {
      const getOutput = (i) => {
        const output = txOutputs[i];
        const styleArr = createStyleArr(themeStyle.txRow);

        if (txOutputs.length === i + 1) {
          styleArr.push(themeStyle.txRowLast);
        }

        return (
          <View style={styleArr} key={i}>
            <TxInfoRow label="To:">{output.address}</TxInfoRow>
            <TxInfoRow label="Amount:">
              {`${numFormat(output.amount / 1e8, txTicker)} ${txTicker}`}
            </TxInfoRow>
          </View>
        );
      };

      const outputs = [];
      for (let i = 0; i < txOutputs.length; i += 1) {
        outputs.push(getOutput(i));
      }

      return outputs;
    };

    const getSignText = () => {
      switch (type) {
        case 'tx':
          return (
            <View style={themeStyle.topContainer}>
              <View style={themeStyle.opacityBackground}>
                <Text h2>Confirm and sign this transaction from</Text>
                <Text
                  bold
                  style={[themeStyle.schemeOwner, themeStyle.highlightText]}
                >
                  {schemeOwner}
                </Text>
              </View>
              <ScrollView style={themeStyle.outputsContainer}>
                {getOutputs()}
              </ScrollView>
              <View
                style={[
                  themeStyle.borderTop,
                  themeStyle.opacityBackground,
                  { paddingTop: 16 },
                ]}
              >
                <TxInfoRow label="Network Fee:">
                  {`${numFormat(txFee / 1e8, txTicker)} ${txTicker}`}
                </TxInfoRow>
                <TxInfoRow dark label="Total Cost:">
                  {`${numFormat(txTotal / 1e8, txTicker)} ${txTicker}`}
                </TxInfoRow>
              </View>
            </View>
          );

        case 'pub':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm checkout of public keys to</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                {schemeOwner}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you agree to send your public keys to the requesting
                party.
              </Text>
              <Text style={{ fontSize: 16 }}>
                Your public keys can only be used to derive addresses and NOT to
                send funds.
              </Text>
            </View>
          );

        case 'val':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Validate address from</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                {schemeOwner}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing we will lookup a valid receive address. You should do
                a manual check to see that the same address is displayed on the
                wallet.
              </Text>
              <Text style={{ fontSize: 16 }}>
                Address validation is an extra security measure to ensure that
                the wallet generates correct receive addresses.
              </Text>
            </View>
          );

        case 'msg':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm and sign this message from</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                {schemeOwner}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>Message:</Text>
              <Text
                style={{
                  fontSize: 16,
                  ...(Platform.OS === 'android'
                    ? { fontFamily: fontStack.bold }
                    : {
                      fontFamily: fontStack.primary,
                      fontWeight: fontWeight.bold,
                    }),
                }}
              >
                {msgMessage}
              </Text>
            </View>
          );

        case '2fa':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm that you want to authenticate with</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                {schemeOwner}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you will login to your wallet.
              </Text>
            </View>
          );

        case 'sah':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm that you want to authenticate with</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                {schemeOwner}
              </Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you will login to your wallet.
              </Text>
            </View>
          );

        default:
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm and sign this</Text>
            </View>
          );
      }
    };

    const getFooter = () => (
      <View
        style={[themeStyle.bottomContainer, themeStyle.opacityBackground]}
      >
        <Button
          onPress={() => {
            this._showAuth(false);
          }}
          isLoading={isLoading}
          isLoadingText={isLoadingText}
        >
            Sign with PIN
        </Button>
      </View>
    );

    const getReason = () => {
      switch (type) {
        case 'tx':
          return 'Sign Transaction';
        case 'pub':
          return 'Checkout Public Keys';
        case '2fa':
          return 'Sign Login Request';
        case 'sah':
          return 'Sign Login Request';
        case 'msg':
          return 'Sign Message';
        default:
          return 'Sign';
      }
    };

    return [
      <View key={1} style={themeStyle.container}>
        {getSignText()}
        {getFooter()}
      </View>,
      <KeyboardWrapper
        key={2}
        ref={(c) => { this._keyboard = c; }}
        type="auth"
        openOnShow={openKeyboardOnShow}
        showTouchId
        reasonMessage={getReason()}
        onValid={this._sign}
      />,
    ];
  }
}

Screen.childContextTypes = {
  theme: PropTypes.string,
};

Screen.propTypes = {
  navigation: PropTypes.object,
};

export default Screen;
