const express = require('express');
const axios = require('axios');
const { API_KEY } = require('./constants');
const { getCache } = require('./cache');

const router = express.Router();
axios.defaults.baseURL = 'https://api.bscscan.com/api';

// Get BNB Balance for a Single Address
router.get('/balance', (req, res) => {
  const { address, tag } = req.query;
  const params = {
    module: 'account',
    action: 'balance',
    apikey: API_KEY,
    address,
    tag
  };
  getCache(res, params);
});

// Get a list of 'Normal' Transactions By Address
router.get('/txlist', (req, res) => {
  const { address, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'txlist',
    apikey: API_KEY,
    address,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  getCache(res, params);
});

// Get a list of 'BEP-20 Token Transfer Events' by Address
router.get('/tokentx', (req, res) => {
  const { address, contractaddress, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'tokentx',
    apikey: API_KEY,
    address,
    contractaddress,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  getCache(res, params);
});

// Get a list of 'BEP-721 Token Transfer Events' by Address
router.get('/tokennfttx', (req, res) => {
  const { address, contractaddress, startblock, endblock, page, offset, sort } = req.query;
  const params = {
    module: 'account',
    action: 'tokennfttx',
    apikey: API_KEY,
    address,
    contractaddress,
    startblock,
    endblock,
    page,
    offset,
    sort
  };
  getCache(res, params);
});

// Get BEP-20 Token Account Balance by ContractAddress
router.get('/tokenbalance', (req, res) => {
  const { address, contractaddress } = req.query;
  const params = {
    module: 'account',
    action: 'tokenbalance',
    apikey: API_KEY,
    address,
    contractaddress,
  };
  getCache(res, params);
});

// Get Address BEP20 Token Holding
router.get('/addresstokenbalance', (req, res) => {
  const { address, page, offset } = req.query;
  const params = {
    module: 'account',
    action: 'addresstokenbalance',
    apikey: API_KEY,
    address,
    page,
    offset
  };
  getCache(res, params);
});

// Get Address BEP721 Token Holding 
router.get('/addresstokennftbalance', (req, res) => {
  const { address, page, offset } = req.query;
  const params = {
    module: 'account',
    action: 'addresstokennftbalance',
    apikey: API_KEY,
    address,
    page,
    offset
  };
  getCache(res, params);
});

module.exports = router;