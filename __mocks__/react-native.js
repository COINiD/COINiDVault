const rn = require('react-native');

jest.useFakeTimers();

jest.mock('Alert', () => ({ alert: jest.fn() }));

jest.mock('NativeModules', () => ({
  RNRandomBytes: {
    seed: '123',
  },
  P2PTransferBLECentralModule: {
    addListener: jest.fn(),
  },
  P2PTransferBLEPeripheralModule: {},
  KeyboardObserver: {
    addListener: jest.fn(),
  },
  StatusBarManager: {
    HEIGHT: 42,
    setColor: jest.fn(),
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    setBackgroundColor: jest.fn(),
    setTranslucent: jest.fn(),
  },
}));

module.exports = rn;
