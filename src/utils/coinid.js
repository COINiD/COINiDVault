/**
 * COINiD Helper
 */

 const coinidPrivate = require('coinid-private');

export const getCoinIdDataFromUrl = (url) => {
  try {
    const data = url.split('://')[1];
    const splitData = data.split('/');
    const [returnScheme, variant] = splitData[0].split(':');
    const coinIdData = splitData.splice(1).join('/');

    if (!returnScheme) {
      throw ('Return scheme is missing...');
    }

    if (!coinIdData) {
      throw ('COINiD data is missing...');
    }

    return {
      returnScheme: returnScheme.toLowerCase(),
      coinIdData,
      variant: variant || '',
    };
  } catch (err) {
    return {
      returnScheme: '',
      coinIdData: '',
      variant: '',
    };
  }
};

export const getInfoFromCoinIdUrl = (url) => {
  const { coinIdData } = getCoinIdDataFromUrl(url);
  return coinidPrivate(coinIdData).getInfo();
};

export const validateCoinIdData = (coinIdData) => {
  try {
    const coinId = coinidPrivate(coinIdData);
    return coinId;
  } catch (err) {
    throw (err);
  }
};

export const validateCoinIdDataFromUrl = (url) => {
  const { coinIdData } = getCoinIdDataFromUrl(url);
  return validateCoinIdData(coinIdData);
};
