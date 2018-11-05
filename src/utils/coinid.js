/**
 * COINiD Helper
 */

export const getCoinIdDataFromUrl = (url) => {
  try {
    const data = url.split('://')[1];
    const splitData = data.split('/');
    const [returnScheme, variant] = splitData[0].split(':');
    const coinIdData = splitData.splice(1).join('/');

    if (!returnScheme) {
      throw('Return scheme is missing...');
    }

    if (!coinIdData) {
      throw('COINiD data is missing...');
    }

    return {
      returnScheme: returnScheme.toLowerCase(),
      coinIdData,
      variant: variant || '',
    };
  }
  catch (err) {
    return {
      returnScheme: '',
      coinIdData: '',
      variant: '',
    };
  }
}

export const validateCoinIdDataFromUrl = (url) => {
  var { returnScheme, coinIdData } = getCoinIdDataFromUrl(url);
  return validateCoinIdData(coinIdData);
}

export const validateCoinIdData = (coinIdData) => {
  try {
    const coinId = require('coinid-private')(coinIdData);
    return true;
  }
  catch(err) {
    throw(err);
    return false;
  }
}