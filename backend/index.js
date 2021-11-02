const express = require('express');
const cors = require('cors');
const { PORT } = require('./constants');
const account = require('./account');
const transaction = require('./transaction');
const token = require('./token');
const stats = require('./stats');

const app = express();

app.use(cors());
app.use('/account', account);
app.use('/transaction', transaction);
app.use('/token', token);
app.use('/stats', stats);

app.listen(PORT, () => {
  console.log(`Demo backend listening at http://localhost:${PORT}`);
});
