const router = require('express').Router();
const txData = require('../utils/readTransactions').txData;
const db = require('./database').db;
const readCustomerTxDeposits = require('../utils/readCustomerDeposits').readCustomerTxDeposits;

router.get('/save', async (req, res) => {
  try {
    await txData(req, res, db);
  } catch (e) {
    res.status(503);
  }
});

router.get('/data', async (req, res) => {
  try {
    await readCustomerTxDeposits(req, res, db);
  } catch (e) {
    res.status(503);
  }
});


module.exports = router;
