import COINiDPrivate from 'coinid-private';
import { getCoinIdDataFromUrl } from '../src/utils/coinid';

const coinArray = [
  'testnet',
  'myriad',
  'bitcoin',
  'groestlcoin',
  'groestlcoin-testnet',
  'litecoin',
];

coinArray.forEach((coin) => {
  describe(coin, () => {
    const { COINiDUrls, sweepedWIF } = require(`./data/${coin}.json`);

    const mnemonic = 'inspire book cream witness surface knee melody duck benefit echo tunnel barrel';

    const getCOINiDFromUrl = (url) => {
      const { returnScheme, coinIdData, variant } = getCoinIdDataFromUrl(url);
      return { coinid: COINiDPrivate(coinIdData), variant, returnScheme };
    };

    describe('COINiDPrivate PUB', () => {
      const { coinid } = getCOINiDFromUrl(COINiDUrls.pubP2SHP2WPKH);

      it('parses info correct', () => {
        expect(getCOINiDFromUrl(COINiDUrls.pubP2SHP2WPKH).coinid.getInfo()).toMatchSnapshot();
        expect(getCOINiDFromUrl(COINiDUrls.pubP2PKH).coinid.getInfo()).toMatchSnapshot();
        expect(getCOINiDFromUrl(COINiDUrls.pubP2WPKH).coinid.getInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        expect(
          await getCOINiDFromUrl(COINiDUrls.pubP2SHP2WPKH).coinid.getReturnData(mnemonic),
        ).toMatchSnapshot();
        expect(
          await getCOINiDFromUrl(COINiDUrls.pubP2PKH).coinid.getReturnData(mnemonic),
        ).toMatchSnapshot();
        expect(
          await getCOINiDFromUrl(COINiDUrls.pubP2WPKH).coinid.getReturnData(mnemonic),
        ).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate VAL', () => {
      const { coinid } = getCOINiDFromUrl(COINiDUrls.val);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const returnData = await coinid.getReturnData(mnemonic);
        expect(returnData).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate TX', () => {
      const { coinid, variant, returnScheme } = getCOINiDFromUrl(COINiDUrls.tx);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('parses transaction info correct', () => {
        expect(coinid.getTxInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const returnData = await coinid.getReturnData(mnemonic);
        expect(returnData).toMatchSnapshot();

        const returnUrl = coinid.buildReturnUrl({
          data: returnData,
          variant,
          returnScheme,
        });
        expect(returnUrl).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate SWPTX', () => {
      const { coinid, variant, returnScheme } = getCOINiDFromUrl(COINiDUrls.swptx);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('parses transaction info correct', () => {
        expect(coinid.getSwpTxInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const returnData = await coinid.getReturnData(mnemonic, { wif: sweepedWIF });
        expect(returnData).toMatchSnapshot();

        const returnUrl = coinid.buildReturnUrl({
          data: returnData,
          variant,
          returnScheme,
        });
        expect(returnUrl).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate SAH', () => {
      const { coinid, variant, returnScheme } = getCOINiDFromUrl(COINiDUrls.sah);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const returnData = await coinid.getReturnData(mnemonic);
        expect(returnData).toMatchSnapshot();

        const returnUrl = coinid.buildReturnUrl({
          data: returnData,
          variant,
          returnScheme,
        });
        expect(returnUrl).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate SWP', () => {
      const { coinid, variant, returnScheme } = getCOINiDFromUrl(COINiDUrls.swp);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('parses sweep data correct', async () => {
        const sweepData = await coinid.parseSweepData(sweepedWIF);
        expect(sweepData).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const sweepData = await coinid.parseSweepData(sweepedWIF);
        const returnData = coinid.getSweepReturnData(sweepData);
        expect(returnData).toMatchSnapshot();

        const returnUrl = coinid.buildReturnUrl({
          data: returnData,
          variant,
          returnScheme,
        });
        expect(returnUrl).toMatchSnapshot();
      });
    });

    describe('COINiDPrivate MSG', () => {
      const { coinid, variant, returnScheme } = getCOINiDFromUrl(COINiDUrls.msg);

      it('parses info correct', () => {
        expect(coinid.getInfo()).toMatchSnapshot();
      });

      it('generates correct return data', async () => {
        const returnData = await coinid.getReturnData(mnemonic);
        expect(returnData).toMatchSnapshot();

        const returnUrl = coinid.buildReturnUrl({
          data: returnData,
          variant,
          returnScheme,
        });
        expect(returnUrl).toMatchSnapshot();
      });
    });
  });
});
