const express = require('express');
const axios = require('axios');
const { BSCSCAN_API_KEY } = require('../constants');
const { fetchFromBscSscan, responseByFetch, fetchFromCoinMarketCap } = require('../common/fetchData');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Get BNB Balance for a Single Address
router.get('/balance', (req, res) => {
  const { address, tag } = req.query;
  const params = {
    module: 'account',
    action: 'balance',
    apikey: BSCSCAN_API_KEY,
    address,
    tag
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get a list of 'Normal' Transactions By Address
router.get('/txlist', (req, res) => {
  const { address, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'txlist',
    apikey: BSCSCAN_API_KEY,
    address,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get a list of 'BEP-20 Token Transfer Events' by Address
router.get('/tokentx', (req, res) => {
  const { address, contractaddress, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'tokentx',
    apikey: BSCSCAN_API_KEY,
    address,
    contractaddress,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get a list of 'BEP-721 Token Transfer Events' by Address
router.get('/tokennfttx', (req, res) => {
  const { address, contractaddress, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'tokennfttx',
    apikey: BSCSCAN_API_KEY,
    address,
    contractaddress,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get BEP-20 Token Account Balance by ContractAddress
router.get('/tokenbalance', (req, res) => {
  const { address, contractaddress } = req.query;
  const params = {
    module: 'account',
    action: 'tokenbalance',
    apikey: BSCSCAN_API_KEY,
    address,
    contractaddress,
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get Address BEP20 Token Holding
router.get('/addresstokenbalance', (req, res) => {
  const { address, page, offset } = req.query;
  const params = {
    module: 'account',
    action: 'addresstokenbalance',
    apikey: BSCSCAN_API_KEY,
    address,
    page,
    offset
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

// Get Address BEP721 Token Holding 
router.get('/addresstokennftbalance', (req, res) => {
  const { address, page, offset } = req.query;
  const params = {
    module: 'account',
    action: 'addresstokennftbalance',
    apikey: BSCSCAN_API_KEY,
    address,
    page,
    offset
  };
  responseByFetch(res, fetchFromBscSscan, params);
});

module.exports = router;