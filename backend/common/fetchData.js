const axios = require('axios').default;
const { getCache, setCache } = require('../cache');
const { COIN_MARKET_CAP_API_KEY } = require('../constants');

const bscscanApi = axios.create();
const coinMarketCapApi = axios.create();
bscscanApi.defaults.baseURL = 'https://api.bscscan.com/api';
coinMarketCapApi.defaults.baseURL = 'https://pro-api.coinmarketcap.com';
coinMarketCapApi.defaults.headers = {
  'X-CMC_PRO_API_KEY': COIN_MARKET_CAP_API_KEY,
}

const fetchFromBscSscan = async (params) => {
  const cacheKey = JSON.stringify(params);
  const result = await getCache(cacheKey);
  if (result) {
    console.log('From Cache');
    return JSON.parse(result);
  } else {
    console.log('Not From Cache');
    const response = await bscscanApi.get('/', { params });
    await setCache(cacheKey, 60, JSON.stringify(response.data));
    return response.data;
  }
}

const fetchFromCoinMarketCap = async (params) => {
  const cacheKey = JSON.stringify(params);
  const result = await getCache(cacheKey);
  if (result) {
    console.log('From Cache');
    return JSON.parse(result);
  } else {
    console.log('Not From Cache');
    const response = await coinMarketCapApi.get('/', { params });
    await setCache(cacheKey, 60, JSON.stringify(response.data));
    return response.data;
  }
}

const responseByFetch = async (res, fetchFn, params) => {
  try {
    const result = await fetchFn(params);
    res.json(result);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = { fetchFromBscSscan, fetchFromCoinMarketCap, responseByFetch };