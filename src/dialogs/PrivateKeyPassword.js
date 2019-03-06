import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity, View, StyleSheet, TextInput,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';

import { fontSize, fontWeight, colors } from '../config/styling';
import {
  DetailsModal, Text, Button, ProgressBar,
} from '../components';

import { findSweepedKeyInStore } from '../utils/sweepkey';

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  passwordLabel: {
    fontSize: fontSize.smallest,
    color: colors.mediumGray,
    fontWeight: fontWeight.medium,
  },
  passwordInputWrapper: {
    borderBottomWidth: 1,
    borderColor: colors.mediumGray,
    marginBottom: 16,
  },
  passwordInput: {
    fontSize: fontSize.smallest,
    color: colors.black,
    paddingTop: 4,
    paddingBottom: 4,
  },
  passwordHintWrapper: {
    marginBottom: 16,
  },
  passwordHintLink: {
    color: colors.purple,
    fontSize: fontSize.smallest,
    fontWeight: fontWeight.medium,
  },
  passwordHint: {
    fontSize: fontSize.smallest,
    fontWeight: fontWeight.normal,
  },
  passwordHintHeader: {
    fontSize: fontSize.smallest,
    fontWeight: fontWeight.normal,
  },
  error: {
    color: colors.orange,
    fontSize: fontSize.smallest,
    fontWeight: fontWeight.book,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    height: 48,
  },
  decryptingContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  decryptingDialog: {},
});

export default class PrivateKeyPassword extends PureComponent {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      inputPassword: '',
      hint: '',
      error: '',
      decryptPercent: 0,
      showPasswordHint: false,
      foundKeyInStore: false,
    };
  }

  _open = ({
    sweepData, hint, parseSweepData, onParsedCb, ticker,
  }) => {
    this.setState({
      hint,
      inputPassword: '',
      error: '',
      showPasswordHint: false,
      foundKeyInStore: false,
    });

    this.sweepData = sweepData;
    this.ticker = ticker;

    this.parseSweepData = parseSweepData;
    this.onParsedCb = onParsedCb;

    this.notReturning = false;
    this.refModal._open();
  };

  _close = () => {
    this.refModal._close();
  };

  _onClosed = () => {
    if (!this.notReturning) {
      this._onReturn();
    }
  };

  _onReturn = () => {
    const { onClosed } = this.props;
    onClosed();
  };

  _statusCb = ({ percent }) => new Promise((resolve) => {
    const decryptPercent = Number(percent);
    this.setState({ decryptPercent }, () => setTimeout(resolve, 0));
  });

  _getFromStore = async (sweepData, password, ticker) => {
    const { encryptedWif } = await this.parseSweepData(sweepData);

    if (encryptedWif) {
      const foundKey = await findSweepedKeyInStore({
        encryptedWif,
        password,
        ticker: ticker.toLowerCase(),
      });

      if (foundKey) {
        return foundKey;
      }
    }

    return false;
  };

  _decryptOrFetch = async (sweepData, password, ticker) => {
    const {
      addresses, encryptedWif, decryptedWif, compressed,
    } = await this._getFromStore(
      sweepData,
      password,
      ticker,
    );

    if (decryptedWif && addresses.length) {
      this.setState({
        foundKeyInStore: true,
      });

      setTimeout(
        () => this.onParsedCb({
          addresses,
          encryptedWif,
          decryptedWif,
          compressed,
          password,
        }),
        500,
      );
    } else {
      this._decryptData(sweepData, password);
    }
  };

  _decryptData = async (sweepData, password) => {
    const {
      addresses, encryptedWif, decryptedWif, compressed,
    } = await this.parseSweepData(
      sweepData,
      password,
      this._statusCb,
    );

    if (decryptedWif && addresses.length) {
      this.onParsedCb({
        addresses,
        encryptedWif,
        decryptedWif,
        compressed,
        password,
      });
    } else {
      this.progressBar._wrongPassword();

      setTimeout(() => {
        this.setState({
          error: 'Entered password was not correct',
          inputPassword: '',
          decryptPercent: 0,
        });

        this.refDecrypting._close();
        this.refModal._open();
        this.notReturning = false;
      }, 1000);
    }
  };

  _continue = () => {
    const { inputPassword } = this.state;

    if (inputPassword && this.sweepData) {
      this.notReturning = true;
      this.refModal._close();
      this.refDecrypting._open();
      setTimeout(() => this._decryptOrFetch(this.sweepData, inputPassword, this.ticker), 500);
    } else {
      if (!inputPassword) {
        this.setState({ error: 'Password cannot be empty' });
      }
      if (!this.sweepData) {
        this.setState({ error: 'Data seems weird' });
      }
    }
  };

  _onChangeText = (inputPassword) => {
    this.setState({ inputPassword, error: '' });
  };

  _onSubmitEditing = () => {
    this._continue();
  };

  _showPasswordHint = () => {
    this.setState({
      showPasswordHint: true,
    });
  };

  _renderHint = () => {
    const { hint, showPasswordHint } = this.state;

    if (!hint) {
      return null;
    }

    if (showPasswordHint) {
      return (
        <View style={styles.passwordHintWrapper}>
          <Text style={styles.passwordHintHeader}>Password hint:</Text>
          <Text style={styles.passwordHint}>{hint}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={this._showPasswordHint} style={styles.passwordHintWrapper}>
        <Text style={styles.passwordHintLink}>Show password hint</Text>
      </TouchableOpacity>
    );
  };

  _renderError = () => {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <Text style={styles.error}>{error}</Text>;
  };

  render() {
    const { inputPassword, decryptPercent, foundKeyInStore } = this.state;

    return (
      <React.Fragment>
        <DetailsModal
          ref={(c) => {
            this.refModal = c;
          }}
          title="Enter Private Key Password"
          onClosed={this._onClosed}
          avoidKeyboard
          avoidKeyboardOffset={16}
        >
          <View
            style={styles.modalContent}
            onLayout={(e) => {
              this.refContHeight = e.nativeEvent.layout.height;
            }}
          >
            <Text style={styles.passwordLabel}>Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={this._onChangeText}
                onSubmitEditing={this._onSubmitEditing}
                autoComplete="off"
                textContentType="password"
                secureTextEntry
                underlineColorAndroid="transparent"
                onFocus={() => {
                  this.refModal._setKeyboardOffset(this.refToBottom - this.refContHeight);
                }}
                onLayout={(e) => {
                  this.refToBottom = e.nativeEvent.layout.y + e.nativeEvent.layout.height;
                }}
                value={inputPassword}
              />
            </View>

            {this._renderError()}

            {this._renderHint()}

            <Button style={styles.button} onPress={this._continue}>
              Continue
            </Button>
          </View>
        </DetailsModal>
        <DetailsModal
          ref={(c) => {
            this.refDecrypting = c;
          }}
          title="Decrypting Private Key"
          dialogStyle={styles.decryptingDialog}
          hideCloseIcon
          preventClosing
        >
          <View style={styles.decryptingContent}>
            <KeepAwake />
            <ProgressBar
              ref={(ref) => {
                this.progressBar = ref;
              }}
              percent={foundKeyInStore ? 100 : decryptPercent}
              customStatus={foundKeyInStore ? 'Previously decrypted key' : ''}
            />
          </View>
        </DetailsModal>
      </React.Fragment>
    );
  }
}
