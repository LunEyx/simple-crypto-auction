const axios = require('axios');
const redis = require('redis');
const { REDIS_PORT } = require('./constants');

axios.defaults.baseURL = 'https://api.bscscan.com/api';
const client = redis.createClient(REDIS_PORT);
client.connect();

client.on('error', (err) => {
  console.log(err);
});

const getCache = async (key) => {
  return await client.get(key);
};

const setCache = async (key, seconds, value) => {
  await client.setEx(key, seconds, value);
}

module.exports = { getCache, setCache };