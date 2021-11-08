const axios = require('axios');
const redis = require('redis');
const { REDIS_PORT } = require('./constants');

axios.defaults.baseURL = 'https://api.bscscan.com/api';
const client = redis.createClient(REDIS_PORT);

client.on('error', (err) => {
  console.log(err);
});


module.exports.getCache = (res, params) => {
  try {
    client.get(JSON.stringify(params), async (err, result) => {
      if (err) throw err;

      if (result) {
        console.log('From Cache');
        res.json(JSON.parse(result));
      } else {
        console.log('Not From Cache');
        axios.get('/', { params })
          .then((response) => {
            client.setex(JSON.stringify(params), 60, JSON.stringify(response.data));
            res.json(response.data);
          });
      }
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

const getRedisCacheAsync = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

module.exports.getCacheWithoutResponse = async (params) => {
  try {
    const result = await getRedisCacheAsync(JSON.stringify(params))
    if (result) {
      console.log('From Cache')
      return JSON.parse(result);
    } else {
      const response = await axios.get('/', { params })
      console.log('Not From Cache')
      client.setex(JSON.stringify(params), 60, JSON.stringify(response.data));
      return response.data;
    }
  } catch (err) {
    console.log(err.message)
  }
}

module.exports.getCacheCustom = (res, params, callback) => {
  try {
    client.get(JSON.stringify(params), async (err, result) => {
      if (err) throw err;

      if (result) {
        console.log('From Cache');
        res.json(JSON.parse(result));
      } else {
        console.log('Not From Cache');
        callback(client);
      }
    })
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}