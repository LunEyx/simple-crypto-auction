const express = require('express');
const axios = require('axios');
const { BSCSCAN_API_KEY } = require('../constants');
const { getCache } = require('../cache');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Check Transaction Receipt Status
router.get('/gettxreceiptstatus', (req, res) => {
  const { txhash } = req.query;
  const params = {
    module: 'transaction',
    action: 'gettxreceiptstatus',
    apikey: BSCSCAN_API_KEY,
    txhash
  };
  getCache(res, params);
});

module.exports = router;

