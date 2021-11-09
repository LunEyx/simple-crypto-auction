const express = require('express');
const axios = require('axios');
const { BSCSCAN_API_KEY } = require('../constants');
const { responseByFetch, fetchFromBscSscan } = require('../common/fetchData');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Get BEP-20 Token TotalSupply by ContractAddress
router.get('/tokensupply', (req, res) => {
  const { contractaddress } = req.query;
  const params = {
    module: 'stats',
    action: 'tokensupply',
    apikey: BSCSCAN_API_KEY,
    contractaddress
  };
  responseByFetch(res, fetchFromBscSscan, params);
});


// Get BEP-20 Token CirculatingSupply by ContractAddress
router.get('/tokenCsupply', (req, res) => {
  const { contractaddress } = req.query;
  const params = {
    module: 'stats',
    action: 'tokenCsupply',
    apikey: BSCSCAN_API_KEY,
    contractaddress
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

module.exports = router;
