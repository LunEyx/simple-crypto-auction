const express = require('express');
const csv = require('csvtojson');
const fs = require('fs');
const {
  ASSETS_FOLDER,
  WALLET_CSV_SUFFIX, WALLET_CSV_NAME_COL, WALLET_CSV_ADDRESS_COL,
  CONTRACT_CSV_SUFFIX, CONTRACT_CSV_NAME_COL, CONTRACT_CSV_ADDRESS_COL,
  TTK_USER_CSV_FILENAME, TTK_USER_CSV_NAME_COL, TTK_USER_CSV_ADDRESS_COL
} = require('../constants');

const router = express.Router();
const fsPromises = fs.promises;

// Read all csv file in assets/ suffixed with 'Wallets'
router.get('/walletAddress', async (req, res) => {
  try {
    let options = {};
    let dictionary = {};
    const filenames = await fsPromises.readdir(ASSETS_FOLDER);
    for (const filename of filenames) {
      if (filename.slice(-12) === WALLET_CSV_SUFFIX) {
        const name = filename.slice(0, -12);
        options[name] = {}
        const data = await csv().fromFile(ASSETS_FOLDER + '/' + filename);
        const lastIndex = Object.keys(data[0]).indexOf(WALLET_CSV_ADDRESS_COL);
        const headers = Object.keys(data[0]).slice(0, lastIndex);
        for (const row of data) {
          let current = options[name];
          if (row[WALLET_CSV_ADDRESS_COL].substring(0, 2) !== '0x') {
            continue;
          }
          for (const header of headers) {
            let type = row[header];
            if (type === '' || type === '#REF!') {
              type = 'Others';
            }
            if (header === WALLET_CSV_NAME_COL) {
              current[row[WALLET_CSV_NAME_COL]] = row[WALLET_CSV_ADDRESS_COL].toLowerCase();
              dictionary[row[WALLET_CSV_ADDRESS_COL].toLowerCase()] = row[WALLET_CSV_NAME_COL];
            } else if (current[type] === undefined) {
              current[type] = {};
            }
            current = current[type];
          }
        }
      }
    }
    res.json({ options, dictionary });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/contractAddress', async (req, res) => {
  try {
    let options = {};
    let dictionary = {};
    const filenames = await fsPromises.readdir(ASSETS_FOLDER);
    for (const filename of filenames) {
      if (filename.slice(-14) === CONTRACT_CSV_SUFFIX) {
        const name = filename.slice(0, -14);
        options[name] = {}
        const data = await csv().fromFile(ASSETS_FOLDER + '/' + filename);
        const lastIndex = Object.keys(data[0]).indexOf(CONTRACT_CSV_ADDRESS_COL);
        const headers = Object.keys(data[0]).slice(0, lastIndex);
        for (const row of data) {
          let current = options[name];
          if (row[CONTRACT_CSV_ADDRESS_COL].substring(0, 2) !== '0x') {
            continue;
          }
          for (const header of headers) {
            let type = row[header];
            if (type === '' || type === '#REF!') {
              type = 'Others';
            }
            if (header === CONTRACT_CSV_NAME_COL) {
              current[row[CONTRACT_CSV_NAME_COL]] = row[CONTRACT_CSV_ADDRESS_COL].toLowerCase();
              dictionary[row[CONTRACT_CSV_ADDRESS_COL].toLowerCase()] = row[CONTRACT_CSV_NAME_COL];
            } else if (current[type] === undefined) {
              current[type] = {};
            }
            current = current[type];
          }
        }
      }
    }
    res.json({ options, dictionary });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/ttkUser', async (req, res) => {
  try {
    let options = {};
    let dictionary = {};
    const filenames = await fsPromises.readdir(ASSETS_FOLDER);
    for (const filename of filenames) {
      if (filename === TTK_USER_CSV_FILENAME) {
        options = {}
        const data = await csv().fromFile(ASSETS_FOLDER + '/' + filename);
        const lastIndex = Object.keys(data[0]).indexOf(TTK_USER_CSV_ADDRESS_COL);
        const headers = Object.keys(data[0]).slice(0, lastIndex);
        for (const row of data) {
          let current = options;
          if (row[TTK_USER_CSV_ADDRESS_COL].substring(0, 2) !== '0x') {
            continue;
          }
          for (const header of headers) {
            let type = row[header];
            if (type === '' || type === '#REF!') {
              type = 'Others';
            }
            if (header === TTK_USER_CSV_NAME_COL) {
              current[row[TTK_USER_CSV_NAME_COL]] = row[TTK_USER_CSV_ADDRESS_COL].toLowerCase();
              dictionary[row[TTK_USER_CSV_ADDRESS_COL].toLowerCase()] = row[TTK_USER_CSV_NAME_COL];
            } else if (current[type] === undefined) {
              current[type] = {};
            }
            current = current[type];
          }
        }
      }
    }
    res.json({ options, dictionary });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;