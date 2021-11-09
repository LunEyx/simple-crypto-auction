const express = require('express');
const axios = require('axios');
const { BSCSCAN_API_KEY } = require('../constants');
const { getCache } = require('../cache');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Get Token Holder List by Contract Address
router.get('/tokenholderlist', (req, res) => {
  const { contractaddress, page, offset } = req.query;
  const params = {
    module: 'token',
    action: 'tokenholderlist',
    apikey: BSCSCAN_API_KEY,
    contractaddress,
    page,
    offset
  };
  getCache(res, params);
});

// Get Token Info by ContractAddress
router.get('/tokeninfo', (req, res) => {
  const { contractaddress } = req.query;
  const params = {
    module: 'token',
    action: 'tokeninfo',
    apikey: BSCSCAN_API_KEY,
    contractaddress,
  };
  getCache(res, params);
});

module.exports = router;
