import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  View, TouchableWithoutFeedback, Animated, Easing, Dimensions,
} from 'react-native';
import { DialogTitle, Modal } from '..';
import styles from './styles';

export default class DetailsModal extends PureComponent {
  _open = () => {
    this.elModal._open();
  };

  _close = () => {
    this.elModal._close();
  };

  _setKeyboardOffset = (offset) => {
    this.elModal._setKeyboardOffset(offset);
  };

  render() {
    const {
      showMoreOptions,
      onMoreOptions,
      hideCloseIcon,
      title,
      children,
      dialogStyle,
    } = this.props;

    return (
      <Modal
        {...this.props}
        ref={(c) => {
          this.elModal = c;
        }}
      >
        <View style={[styles.dialog, dialogStyle]}>
          <DialogTitle
            title={title}
            closeFunc={this._close}
            showMoreOptions={showMoreOptions}
            onMoreOptions={onMoreOptions}
            hideCloseIcon={hideCloseIcon}
          />
          <View
            style={{
              marginTop: -56,
              paddingTop: 56,
              maxHeight: '100%',
            }}
          >
            {children}
          </View>
        </View>
      </Modal>
    );
  }
}

DetailsModal.propTypes = {
  title: PropTypes.string,
  verticalPosition: PropTypes.string,
};

DetailsModal.defaultProps = {
  title: 'Untitled',
  verticalPosition: 'center',
  showMoreOptions: false,
  onMoreOptions: () => {},
  onClosed: () => {},
  onOpened: () => {},
  onLayout: () => {},
};
