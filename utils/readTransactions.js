const fs = require('fs');
const axios = require('axios');

const txData = (req, res, db) => {
  fs.readFile('utils/txs.json', (err, data) => {
    if (err) {
      throw err;
    }

    const result = data.toString('utf8');
    const resObj = JSON.parse(result);
    Object.values(resObj).map(collection => {
      Object.values(collection).map((item, index) => {
          let tx = Object.values(item);
          //let's us insert array data type into postgres for walletconflicts
          tx[12] = '{}';

          db.query({
            text:`INSERT INTO transactions (
                    involves_watch_only,
                    account,
                    address,
                    category,
                    amount,
                    label,
                    vout,
                    confirmations,
                    blockhash,
                    blockindex,
                    blocktime,
                    txid,
                    wallet_conflicts,
                    time,
                    time_received,
                    bip125_replaceable
                  )
                  VALUES(
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9,
                    $10,
                    $11,
                    $12,
                    $13,
                    $14,
                    $15,
                    $16
                  )
                  RETURNING *`,
            values: tx
          }).then(info => {
            if (index === Object.values(collection).length - 1) {
              axios.get('http://localhost:5000/data').then(fin => {
                console.log(fin.data)
                process.exit(0);
              });
            }
          })
          .catch(error => {
            let a = ''
          });
      });
    });
  })
}


module.exports = {
  txData
}
