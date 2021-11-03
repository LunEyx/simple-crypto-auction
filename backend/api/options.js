const express = require('express');
const csv = require('csvtojson');
const fs = require('fs');
const { log } = require('console');

const router = express.Router();
const fsPromises = fs.promises;
const directory = './assets';



// Read all csv file in assets/ suffixed with 'Wallets'
router.get('/walletAddress', async (req, res) => {
  try {
    let options = {};
    const filenames = await fsPromises.readdir(directory);
    for (const filename of filenames) {
      if (filename.slice(-12) === ' Wallets.csv') {
        const name = filename.slice(0, -12);
        options[name] = {}
        const data = await csv().fromFile(directory + '/' + filename);
        const lastIndex = Object.keys(data[0]).indexOf('Wallet address');
        const headers = Object.keys(data[0]).slice(0, lastIndex);
        for (const row of data) {
          let current = options[name];
          if (row['Wallet address'].substring(0, 2) !== '0x') {
            continue;
          }
          for (const header of headers) {
            let type = row[header];
            if (type === '' || type === '#REF!') {
              type = 'Others';
            }
            if (header === 'Name') {
              current[row['Name']] = row['Wallet address'];
            } else if (current[type] === undefined) {
              current[type] = {};
            }
            current = current[type];
          }
        }
      }
    }
    res.json(options);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

router.get('/contractAddress', async (req, res) => {
  try {
    let options = {};
    const filenames = await fsPromises.readdir(directory);
    console.log(filenames)
    for (const filename of filenames) {
      if (filename.slice(-14) === ' Contracts.csv') {
        const name = filename.slice(0, -14);
        options[name] = {}
        const data = await csv().fromFile(directory + '/' + filename);
        const lastIndex = Object.keys(data[0]).indexOf('Address');
        const headers = Object.keys(data[0]).slice(0, lastIndex);
        for (const row of data) {
          let current = options[name];
          if (row['Address'].substring(0, 2) !== '0x') {
            continue;
          }
          for (const header of headers) {
            let type = row[header];
            if (type === '' || type === '#REF!') {
              type = 'Others';
            }
            if (header === 'Contract') {
              current[row['Contract']] = row['Address'];
            } else if (current[type] === undefined) {
              current[type] = {};
            }
            current = current[type];
          }
        }
      }
    }
    res.json(options);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;