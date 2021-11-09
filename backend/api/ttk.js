const express = require('express');
const axios = require('axios').default;
const {
  TTK_SYMBOL, MAX_COUNT_HOURLY, BSCSCAN_API_KEY, COIN_MARKET_CAP_API_KEY,
  TTK_CONTRACT_ADDRESS, TTK_USER_ADDRESS, TTK_USER_CSV_ADDRESS_COL
} = require('../constants');
const { getCache, setCache } = require('../cache');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';
const axiosCoinMarketCap = axios.create();
axiosCoinMarketCap.defaults.baseURL = 'https://pro-api.coinmarketcap.com';
axiosCoinMarketCap.defaults.headers = {
  'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_API_KEY,
}

// Get TTK token transactions
router.get('/txlist', async (req, res) => {
  const {  startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'ttk',
    action: 'txlist',
    apikey: BSCSCAN_API_KEY,
  };
  try {
    const result = await getCache(JSON.stringify(params));
    if (result) {
      res.json(JSON.parse(result));
    } else {
      const data = {};
      for (const address of TTK_USER_ADDRESS) {
        const internalParams = {
          module: 'account',
          action: 'tokentx',
          apikey: BSCSCAN_API_KEY,
          address,
          contractaddress: TTK_CONTRACT_ADDRESS,
          startblock,
          endblock,
          page,
          offset,
          sort
        };
        const result = await getCache(JSON.stringify(internalParams));
        if (result) {
          console.log('From Cache');
          data[address] = JSON.parse(result);
        } else {
          let retry = 1;
          let max_retry = 5;
          console.log('Not From Cache');
          while (retry < max_retry) {
            retry++;
            const response = await axios.get('/', { params: internalParams });
            if (response.data.status === '1') {
              await setCache(JSON.stringify(internalParams), 60, JSON.stringify(response.data.result));
              data[address] = response.data.result;
              retry = max_retry;
            } else {
              console.log(`Retry...${retry}`);
              await new Promise((resolve) => setTimeout(() => {
                resolve()
              }, 1000));
            }
          }
        }
      }
      await setCache(JSON.stringify(params), 60, JSON.stringify(data))
      res.json(data)
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/historicalPrice', async (req, res) => {
  const { baseUrl, time_start, time_end, interval = 'hourly', count = MAX_COUNT_HOURLY } = req;
  const params = {
    baseUrl,
    time_start,
    time_end,
    interval,
    count
  };
  const cacheKey = JSON.stringify(params);

  try {
    const result = await getCache(cacheKey);
    if (result) {
      console.log('From Cache');
      res.json(JSON.parse(result));
    } else {
      console.log('Not From Cache');
      try {
        const params = {
          symbol: TTK_SYMBOL,
          time_start,
          time_end,
          interval,
          count
        }
        const response = await axiosCoinMarketCap.get('/v1/cryptocurrency/quotes/historical', { params });
        setCache(cacheKey, 3600, JSON.stringify(response.data));
        res.json(response.data);
      } catch (err) {
        res.send(err.response.data);
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
})

module.exports = router;