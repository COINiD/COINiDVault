import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, AsyncStorage } from 'react-native';
import {
  DetailsModal, Text, Button, CheckBoxSelect,
} from '../../components';
import styles from './styles';

export default class SelectColdTransportType extends PureComponent {
  constructor(props) {
    super(props);

    const selectData = [{
      title: 'QR Code',
      description: 'Uses QR Codes to communicate between wallet and offline device.',
      returnValue: 'qr',
    }, {
      title: 'Bluetooth Low Energy',
      description: 'Uses BLE to communicate between wallet and offline device.',
      returnValue: 'ble',
    }];

    this.state = {
      selectedIndex: 0,
      selectData,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('@SelectColdTransportType:returnValue')
      .then((data) => {
        if (data !== null) {
          const { selectData } = this.state;
          const returnValue = JSON.parse(data);
          const selectedIndex = selectData.map(e => e.returnValue).indexOf(returnValue);

          if (selectedIndex !== -1) {
            this.setState({ selectedIndex });
          }
        }
      });
  }

  _open = (onSelectCb) => {
    this.detailsModal._open();
    this.onSelectCb = onSelectCb;
  };

  _close = () => {
    this.detailsModal._close();
  };

  _continue = () => {
    const { selectedIndex, selectData } = this.state;
    const { returnValue } = selectData[selectedIndex];
    const { onSelectColdTransportType } = this.props;

    onSelectColdTransportType(returnValue);
    this.onSelectCb(returnValue);

    this._close();

    this._save(returnValue);
  };

  _save = (returnValue) => {
    AsyncStorage.setItem('@SelectColdTransportType:returnValue', JSON.stringify(returnValue));
  }

  render() {
    const { selectedIndex, selectData } = this.state;
    const selectedOption = selectData[selectedIndex];

    return (
      <DetailsModal
        ref={(c) => {
          this.detailsModal = c;
        }}
        title="Choose how to connect"
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 16 }}>
            Select how you would like to connect to the COINiD Wallet.
          </Text>
          <View style={{ marginTop: 16 }}>
            <CheckBoxSelect
              onIndexChange={(newIndex) => { this.setState({ selectedIndex: newIndex }); }}
              selectedIndex={selectedIndex}
              data={selectData}
            />
          </View>
          <Text
            style={{
              marginTop: 16,
              fontSize: 16,
              color: '#8A8A8F',
            }}
          >
            {selectedOption.description}
          </Text>
          <Button style={{ marginTop: 24 }} onPress={this._continue}>
            Continue
          </Button>
        </View>
      </DetailsModal>
    );
  }
}

SelectColdTransportType.propTypes = {
  onSelectColdTransportType: PropTypes.func,
};

SelectColdTransportType.defaultProps = {
  onSelectColdTransportType: () => {},
};
