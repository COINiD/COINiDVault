import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Alert, View, Platform, ScrollView,
} from 'react-native';

import styles from './styles';
import { fontStack, fontWeight } from '../../config/styling';

import {
  Button, Text, TxInfoRow, KeyboardWrapper,
} from '../../components';

import { loadMnemonic } from '../../utils/mnemonic';
import { getCoinIdDataFromUrl } from '../../utils/coinid';
import { numFormat } from '../../utils/numFormat';
import createStyleArr from '../../utils/createStyleArr';
import { findSweepedKeyInStore } from '../../utils/sweepkey';

class Screen extends Component {
  themeStyle = '';

  theme = '';

  url = '';

  constructor(props): void {
    super(props);

    const {
      navigation: {
        state: {
          params: { theme, url },
        },
      },
    } = this.props;
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
        case 'coinid-ltc':
          return 'Litecoin Wallet for COINiD';
        case 'coinid-btc':
          return 'Bitcoin Wallet for COINiD';
        case 'coinid-tbtc':
          return 'Testnet Wallet for COINiD';
        case 'coinid-xmy':
          return 'Myriad Wallet for COINiD';
        case 'coinid-grs':
          return 'Groestlcoin Wallet for COINiD';
        case 'coinid-tgrs':
          return 'GRS Testnet Wallet for COINiD';
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
        txFee: txInfo.fee,
        txTotal: txInfo.externalTotal + txInfo.fee,
        txTicker: info.network.ticker,
      });
    }

    if (info.type === 'swptx') {
      const swpTxInfo = coinId.getSwpTxInfo();

      const swpTxAddressGroups = swpTxInfo.inputs.reduce((a, { address, satValue }) => {
        const acc = { ...a };
        if (!acc[address]) {
          acc[address] = { address, satValue };
        } else {
          acc[address].satValue += satValue;
        }

        return acc;
      }, {});

      this.setState({
        isLoadingText: 'Signing',
        swpTxReceiveAddress: swpTxInfo.receiveAddress,
        swpTxInputs: swpTxInfo.inputs,
        swpTxFee: swpTxInfo.fee,
        swpTxTotal: swpTxInfo.total - swpTxInfo.fee,
        swpTxTicker: info.network.ticker,
        swpTxAddressGroups: Object.values(swpTxAddressGroups),
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

  _sign = async (pin) => {
    const {
      navigation: {
        goBack,
        state: {
          params: { onDone, onError },
        },
      },
    } = this.props;

    const {
      coinId, returnScheme, type, variant,
    } = this.state;

    const extraData = {};
    if (type === 'swptx') {
      const { ticker } = coinId.getInfo();
      const { swpTxAddressGroups } = this.state;
      const { address: sweepAddress } = swpTxAddressGroups[0];

      const foundKey = await findSweepedKeyInStore({
        address: sweepAddress,
        ticker: ticker.toLowerCase(),
      });

      extraData.wif = foundKey.decryptedWif;
    }

    this.setState({
      isLoading: true,
    });
    this._keyboard._hideKeyboard();

    loadMnemonic(pin).then((mnemonic) => {
      if (mnemonic) {
        coinId
          .getReturnData(mnemonic, extraData)
          .then((data) => {
            let returnUrl = coinId.buildReturnUrl({ data, returnScheme, variant });

            if (type === 'val') {
              Alert.alert('Validated address', data);
              returnUrl = null; // do not send anything back if validate address
            }

            goBack();
            setTimeout(() => onDone({ variant, returnUrl }), 400);
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
      openKeyboardOnShow,
      txOutputs,
      txTicker,
      type,
      schemeOwner,
      txFee,
      txTotal,
      msgMessage,
      isLoading,
      isLoadingText,
      swpTxReceiveAddress,
      swpTxInputs,
      swpTxFee,
      swpTxTotal,
      swpTxTicker,
      swpTxAddressGroups,
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
            <TxInfoRow label="To:" labelStyle={themeStyle.labelStyle}>
              {output.address}
            </TxInfoRow>
            <TxInfoRow label="Amount:" labelStyle={themeStyle.labelStyle}>
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
              <View style={[themeStyle.opacityBackground, themeStyle.marginToPaddingTop]}>
                <Text h2>Confirm and sign this transaction from</Text>
                <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                  {schemeOwner}
                </Text>
              </View>
              <ScrollView style={themeStyle.outputsContainer}>{getOutputs()}</ScrollView>
              <View
                style={[themeStyle.borderTop, themeStyle.opacityBackground, { paddingTop: 16 }]}
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

        case 'swptx':
          return (
            <View style={themeStyle.topContainer}>
              <View style={[themeStyle.opacityBackground, themeStyle.marginToPaddingTop]}>
                <Text h2>Confirm private key sweep to</Text>
                <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>
                  {schemeOwner}
                </Text>
              </View>
              <ScrollView style={themeStyle.outputsContainer}>
                <View style={[{ paddingBottom: 16 }, createStyleArr(themeStyle.txRow)]}>
                  <TxInfoRow label="To" labelStyle={themeStyle.labelStyle}>
                    {swpTxReceiveAddress}
                  </TxInfoRow>
                </View>

                {swpTxAddressGroups.map(({ address, satValue }) => (
                  <View style={{ paddingBottom: 16 }} key={address}>
                    <TxInfoRow label="From" labelStyle={themeStyle.labelStyle}>
                      {address}
                    </TxInfoRow>
                    <TxInfoRow label="Amount" labelStyle={themeStyle.labelStyle}>
                      {`${numFormat(satValue / 1e8, swpTxTicker)} ${swpTxTicker}`}
                    </TxInfoRow>
                  </View>
                ))}
              </ScrollView>
              <View
                style={[themeStyle.borderTop, themeStyle.opacityBackground, { paddingTop: 16 }]}
              >
                <TxInfoRow label="Network Fee:">
                  {`${numFormat(swpTxFee / 1e8, swpTxTicker)} ${swpTxTicker}`}
                </TxInfoRow>
                <TxInfoRow dark label="Total:">
                  {`${numFormat(swpTxTotal / 1e8, swpTxTicker)} ${swpTxTicker}`}
                </TxInfoRow>
              </View>
            </View>
          );

        case 'pub':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm checkout of public keys to</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you agree to send your public keys to the requesting party.
              </Text>
              <Text style={{ fontSize: 16 }}>
                Your public keys can only be used to derive addresses and NOT to send funds.
              </Text>
            </View>
          );

        case 'val':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Validate address from</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing we will lookup a valid receive address. You should do a manual check to
                ensure that the same address is displayed in the wallet.
              </Text>
              <Text style={{ fontSize: 16 }}>
                Address validation is an extra security measure to ensure that the wallet generates
                correct receive addresses.
              </Text>
            </View>
          );

        case 'msg':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm and sign this message from</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
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
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you will login to your wallet.
              </Text>
            </View>
          );

        case 'sah':
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Confirm that you want to authenticate with</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                By signing you will login to your wallet.
              </Text>
            </View>
          );

        default:
          return (
            <View style={themeStyle.topContainer}>
              <Text h2>Unsupported request from</Text>
              <Text style={[themeStyle.schemeOwner, themeStyle.highlightText]}>{schemeOwner}</Text>
              <Text style={{ fontSize: 16, paddingBottom: 16 }}>
                Please update to the latest version of the COINiD Vault to handle this request.
              </Text>
            </View>
          );
      }
    };

    const getFooter = () => {
      switch (type) {
        case 'swptx':
        case 'tx':
        case 'pub':
        case 'val':
        case '2fa':
        case 'sah':
        case 'msg':
          return (
            <View
              style={[
                themeStyle.bottomContainer,
                themeStyle.opacityBackground,
                themeStyle.marginToPaddingBottom,
              ]}
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
        default:
          return <View />;
      }
    };

    const getReason = () => {
      switch (type) {
        case 'tx':
          return 'Sign Transaction';
        case 'swptx':
          return 'Sign Sweep Transaction';
        case 'pub':
          return 'Checkout Public Keys';
        case '2fa':
          return 'Sign Login Request';
        case 'sah':
          return 'Sign Login Request';
        case 'msg':
          return 'Sign Message';
        case 'val':
          return 'Validate Address';
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
        ref={(c) => {
          this._keyboard = c;
        }}
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
