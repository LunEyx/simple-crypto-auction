const express = require('express');
const cors = require('cors');
const { PORT } = require('./constants');
const account = require('./api/account');
const transaction = require('./api/transaction');
const token = require('./api/token');
const stats = require('./api/stats');
const address = require('./api/address');
const ttk = require('./api/ttk');

const app = express();

app.use(cors());
app.use('/api/account', account);
app.use('/api/transaction', transaction);
app.use('/api/token', token);
app.use('/api/stats', stats);
app.use('/api/address', address);
app.use('/api/ttk', ttk);

app.listen(PORT, () => {
  console.log(`Demo backend listening at http://localhost:${PORT}`);
});
