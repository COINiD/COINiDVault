import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Linking, View, Alert } from 'react-native';
import { Icon, List, ListItem } from 'react-native-elements';

import { NavigationActions } from 'react-navigation';

import { Button, Loading, Text, KeyboardWrapper } from '../../components';

import { colors } from '../../config/styling';
import { settings } from '../../config/settings';

import styles from './styles';

import { removeMnemonic, loadMnemonic } from '../../utils/mnemonic';

class Screen extends PureComponent {
  themeStyle = '';
  theme = '';

  constructor(props): void {
    super(props);

    const { theme } = this.props.navigation.state.params || {};
    this.theme = theme;
    this.themeStyle = styles(theme);

    this.state = {
      isLoading: false,
      authReason: '',
      authInfo: '',
      authCallback: () => {},
    };
  }

  getChildContext = () => ({ theme: this.theme });

  _about = () => {
    return Linking.openURL(settings.aboutUrl);
  };

  _updatePIN = pin => {
    this.props.navigation.navigate('UpdatePIN', { pin: pin, theme: 'dark' });
  };

  _showUpdatePINAuth = () => {
    this.setState({
      authReason: 'Update PIN',
      authInfo: 'Enter old PIN',
      authCallback: this._updatePIN,
    });
    this._p2pKeyboard._showKeyboard();
  };

  _resetCOINiDConfirmed = () => {
    removeMnemonic().then(() => {
      this.props.navigation.state.params.onReady();
      this.props.navigation.goBack();
    });
  }

  _resetCoinId = () => {
    Alert.alert(
      'Are you sure?',
      'This will delete the stored mnemonic, make sure you have a backup...',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => this._resetCOINiDConfirmed() },
      ],
      { cancelable: true }
    )

  };

  _backupCoinId = pin => {
    this.props.navigation.navigate('Backup', { pin: pin, theme: 'dark' });
  };

  _showBackupAuth = () => {
    this.setState({
      authReason: 'Backup mnemonic',
      authInfo: '',
      authCallback: this._backupCoinId,
    });
    this._p2pKeyboard._showKeyboard();
  };

  render = function() {
    const themeStyle = this.themeStyle;

    if (this.state.isLoading) {
      return <Loading />;
    }

    const settings = [
      {
        title: 'Update PIN',
        onPress: this._showUpdatePINAuth,
      },
      {
        title: 'Backup',
        onPress: this._showBackupAuth,
      },
      {
        title: 'Reset',
        titleStyle: [themeStyle.listItemTitle, themeStyle.warningText],
        onPress: this._resetCoinId,
        hideChevron: true,
      },
      {
        title: 'About',
        titleStyle: [themeStyle.listItemTitle, themeStyle.highlightText],
        onPress: this._about,
        hideChevron: true,
      },
    ];

    const getSettings = () => {
      return (
        <View key={1} style={themeStyle.container}>
          <View style={themeStyle.topContainer}>
            <Icon
              size={24}
              name="arrow-left"
              type="material-community"
              containerStyle={[themeStyle.topIcon, themeStyle.topIconLeft]}
              onPress={() => this.props.navigation.goBack()}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            />
            <Text h1>Settings</Text>
            <List containerStyle={themeStyle.list}>
              {settings.map((item, i) => (
                <ListItem
                  key={i}
                  containerStyle={themeStyle.listItem}
                  titleStyle={themeStyle.listItemTitle}
                  wrapperStyle={themeStyle.listItemTitleContainer}
                  title={item.title}
                  onPress={item.onPress}
                  rightIcon={{
                    color: colors.getTheme(this.theme).text,
                  }}
                  {...item}
                />
              ))}
            </List>
          </View>
        </View>
      );
    };

    return [
      getSettings(),
      <KeyboardWrapper
        key={2}
        type={'auth'}
        showTouchId={true}
        infoMessage={this.state.authInfo}
        reasonMessage={this.state.authReason}
        ref={(c) => this._p2pKeyboard = c}
        onValid={this.state.authCallback}
      />,
    ];
  };
}

Screen.childContextTypes = {
  theme: PropTypes.string,
};

Screen.propTypes = {
  navigation: PropTypes.object,
};

export default Screen;
