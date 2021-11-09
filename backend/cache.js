const axios = require('axios');
const redis = require('redis');
const { REDIS_PORT } = require('./constants');

axios.defaults.baseURL = 'https://api.bscscan.com/api';
const client = redis.createClient(REDIS_PORT);
client.connect();

client.on('error', (err) => {
  console.log(err);
});

// const getCache = async (key) => {
//   return await client.get(key);
// };

// const setCache = async (key, seconds, value) => {
//   await client.setEx(key, seconds, value);
// }

module.exports = { getCache, setCache };

module.exports.getCache = async (res, params) => {
  try {
    const result = await client.get(JSON.stringify(params));
    if (result) {
      console.log('From Cache');
      res.json(JSON.parse(result));
    } else {
      console.log('Not From Cache');
      const response = await axios.get('/', { params });
      await client.setEx(JSON.stringify(params), 60, JSON.stringify(response.data));
      res.json(response.data);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports.getCacheWithoutResponse = async (params) => {
  try {
    const result = await client.get(JSON.stringify(params))
    if (result) {
      console.log('From Cache')
      return JSON.parse(result);
    } else {
      const response = await axios.get('/', { params })
      console.log('Not From Cache')
      client.setEx(JSON.stringify(params), 60, JSON.stringify(response.data));
      return response.data;
    }
  } catch (err) {
    console.log(err.message)
  }
}

module.exports.getCacheCustom = async (res, params, callback) => {
  try {
    const result = await client.get(JSON.stringify(params))
    if (result) {
      console.log('From Cache');
      res.json(JSON.parse(result));
    } else {
      console.log('Not From Cache');
      callback(client);
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}