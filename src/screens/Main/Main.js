import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, View, Linking, AppState,
} from 'react-native';

import { Icon } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import blePeripheral from 'react-native-p2p-transfer-ble-peripheral';

import styles from './styles';
import {
  Button, Loading, Text, KeyboardWrapper,
} from '../../components';
import {
  SelectColdTransportType,
} from '../../dialogs';
import { colors } from '../../config/styling';

import { hasMnemonic } from '../../utils/mnemonic';
import { validateCoinIdDataFromUrl } from '../../utils/coinid';

import { p2pClient } from '../../utils/p2p-ble-peripheral';


const lottieFiles = {
  logo: require('../../animations/logo.json'),
};

class Screen extends Component {
  queuedUrl;

  constructor(props): void {
    super(props);

    this.state = {
      isReady: false,
      isLoading: true,
      statusText: '',
      isConnecting: false,
      isBLESupported: true,
    };

    this._checkForMnemonic();
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleUrlEvent);
    Linking.getInitialURL().then(url => this._handleOpenURL(url));

    AppState.addEventListener('change', this._handleAppStateChange);

    /*
    blePeripheral.isSupported().then((isBLESupported) => {
      this.setState({isBLESupported});
    });
    */
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleUrlEvent);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState.match(/inactive|background/)) {
      this.queuedUrl = '';
    }
  };

  _handleUrlEvent = (e) => {
    this._handleOpenURL(e.url);
  };

  _handleOpenURL = (url) => {
    if (url) {
      this._handleOpenURLPromise(url)
        .then((returnUrl) => {
          if (returnUrl !== null) {
            Linking.openURL(returnUrl);
          }
        })
        .catch(() => {
          // ?
        });
    }
  };

  _handleOpenURLPromise(url) {
    return new Promise((resolve, reject) => {
      hasMnemonic() // only load to check if it exists..
        .then(() => {
          this.queuedUrl = '';

          const signingDone = ({ variant, returnUrl }) => resolve(returnUrl);

          const signingError = error => reject(error);

          try {
            if (validateCoinIdDataFromUrl(url)) {
              const { navigation: { navigate, goBack } } = this.props;

              goBack('sign-123'); // remove old sign modal if active..

              navigate({
                routeName: 'Sign',
                params: {
                  theme: 'white',
                  url,
                  onSigned: signingDone,
                  onError: signingError,
                },
                key: 'sign-123',
              });
            }
          } catch (error) {
            Alert.alert('Invalid COINiD data', error);
            return reject(error);
          }
        })
        .catch((error) => {
          this.queuedUrl = url;
        });
    });
  }

  _checkForMnemonic() {
    return hasMnemonic()
      .then(() => {
        this.setState({
          isLoading: false,
          isReady: true,
        });

        SplashScreen.hide();
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          isReady: false,
        });

        SplashScreen.hide();
      });
  }

  _connectToWallet = (p2pCode) => {
    this.setState({
      statusText: 'Connecting',
      isConnecting: true,
    });

    const cbConnected = () => {
      this.setState({
        statusText: 'Connected',
        isConnecting: true,
      });
    };

    const cbReceiveProgress = (data) => {
      const progress = 100 * (parseFloat(data.receivedBytes) / parseFloat(data.finalBytes));
      this.setState({
        statusText: `Receiving Data ${progress.toFixed(0)}%`,
        isConnecting: true,
      });
    };

    const cbSendProgress = (data) => {
      const progress = 100 * (parseFloat(data.receivedBytes) / parseFloat(data.finalBytes));

      this.setState({
        statusText: `Sending Data ${progress.toFixed(0)}%`,
        isConnecting: true,
      });
    };

    const p2p = p2pClient(p2pCode, { cbConnected, cbReceiveProgress, cbSendProgress });
    p2p
      .getData()
      .then((data) => {
        this.setState({
          statusText: 'Received Data',
        });

        this._handleOpenURLPromise(data)
          .then((signedData) => {
            this.setState({
              statusText: 'Sending Data',
            });

            p2p
              .sendData(signedData)
              .then(() => {
                this.setState({
                  statusText: '',
                  isConnecting: false,
                });
              })
              .catch((error) => {
                Alert.alert(error);

                this.setState({
                  statusText: '',
                  isConnecting: false,
                });
                p2p.stop();
              });
          })
          .catch((error) => {
            this.setState({
              statusText: '',
              isConnecting: false,
            });
          });
      })
      .catch((error) => {
        Alert.alert(error);
        this.setState({
          statusText: '',
          isConnecting: false,
        });
        p2p.stop();
      });
  };

  _startColdSigning = () => {
    this.coldTransportModal._open((transportType) => {
      if (transportType === 'ble') {
        this._showP2PKeyboard();
      }

      if (transportType === 'qr') {
        const { navigation: { navigate } } = this.props;

        navigate('QRDataReceiver', {
          onComplete: (data) => {
            this._handleOpenURLPromise(data)
              .then((signedData) => {
                if (signedData) {
                  navigate('QRDataSender', {
                    data: signedData,
                    theme: 'darkblue',
                  });
                }
              });
          },
        });
      }
    });
  }

  _showP2PKeyboard = () => {
    this._p2pKeyboard._showKeyboard();
  };

  render() {
    const { navigate } = this.props.navigation;
    const { theme } = this.props.navigation.state.params || {};
    const themeStyle = styles(theme);
    const { isBLESupported } = this.state;

    // called after create or recover steps are completed
    const onReady = () => {
      this.setState({
        isLoading: true,
      });

      this._checkForMnemonic().then(() => {
        if (this.queuedUrl) {
          this._handleOpenURL(this.queuedUrl);
        }
      });
    };

    // Shows while loading Mnemonic
    if (this.state.isLoading) {
      return (
        <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Loading />
          <Text h2 style={{ marginTop: 10 }}>
            Please Wait...
          </Text>
        </View>
      );
    }

    const renderExternalButton = () => {
      if (!isBLESupported) {
        return (
          <Text button style={themeStyle.supportText}>This device only supports hot wallet signing</Text>
        );
      }

      return (
        <Button
          link
          onPress={this._startColdSigning}
          isLoadingText={this.state.statusText}
          isLoading={this.state.isConnecting}
        >
          Sign cold wallet request
        </Button>
      );
    };

    // Shows when mnemonic exists and is stored on device
    if (this.state.isReady) {
      return [
        <View key={1} style={themeStyle.container}>
          <View style={themeStyle.topContainer}>
            <Icon
              reverse
              size={24}
              name="settings"
              color={colors.getTheme().highlight}
              iconStyle={{
                padding: 0, margin: 0, height: 24, width: 24,
              }}
              containerStyle={themeStyle.topIcon}
              onPress={() => navigate('Settings', { onReady, theme: 'light' })}
              hitSlop={{
                top: 20, bottom: 20, left: 20, right: 20,
              }}
            />
            <Text h1>
              COINiD Vault is all set
            </Text>
            <Text h3>Ready to sign COINiD requests</Text>
          </View>
          <View style={[themeStyle.bottomContainer]}>
            { renderExternalButton() }
            <View
              style={{
                marginTop: 16,
                marginBottom: 8,
                width: 110,
                height: 45,
                alignSelf: 'center',
              }}
            >
              <LottieView
                progress={1}
                source={lottieFiles.logo}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
          </View>
        </View>,
        <KeyboardWrapper
          key={2}
          ref={c => (this._p2pKeyboard = c)}
          type="p2p"
          onValid={(p2pCode) => {
            this._p2pKeyboard._hideKeyboard();
            this._connectToWallet(p2pCode);
          }}
        />,
        <SelectColdTransportType
          key={3}
          ref={(c) => { this.coldTransportModal = c; }}
        />,
      ];
    }

    // Shows when mnemonic is missing
    return (
      <View style={{ flex: 1 }}>
        <View style={themeStyle.container}>
          <View style={themeStyle.topContainer}>
            <Text h1>
              {'Welcome to '}
              <Text h1 style={themeStyle.highlightText}>
                COINiD Vault
              </Text>
            </Text>
            <Text h3>Choose one of the following to continue.</Text>
          </View>
          <View style={themeStyle.bottomContainer}>
            <Button onPress={() => navigate('Create', { onReady, theme: 'dark' })}>
              Create new COINiD Vault
            </Button>
            <Button secondary onPress={() => navigate('Recover', { onReady, theme: 'dark' })}>
              Recover COINiD Vault
            </Button>
            <View
              style={{
                marginTop: 24,
                marginBottom: 8,
                width: 110,
                height: 45,
                alignSelf: 'center',
              }}
            >
              <LottieView
                progress={1}
                source={lottieFiles.logo}
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

Screen.propTypes = {
  navigation: PropTypes.object,
};

export default Screen;
