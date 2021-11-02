const express = require('express');
const axios = require('axios');
const { API_KEY } = require('./constants');
const { getCache } = require('./cache');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Get BEP-20 Token TotalSupply by ContractAddress
router.get('/tokensupply', (req, res) => {
  const { contractaddress } = req.query;
  const params = {
    module: 'stats',
    action: 'tokensupply',
    apikey: API_KEY,
    contractaddress
  };
  getCache(res, params);
});


// Get BEP-20 Token CirculatingSupply by ContractAddress
router.get('/tokenCsupply', (req, res) => {
  const { contractaddress } = req.query;
  const params = {
    module: 'stats',
    action: 'tokenCsupply',
    apikey: API_KEY,
    contractaddress
  };
  getCache(res, params);
});

module.exports = router;
