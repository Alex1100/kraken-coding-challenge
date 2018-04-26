const dissolveExponentialNotation = require('./dissolveExponentialNotation');

const customerHashMap = {
  "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ": "Wesley Crusher",
  "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp": "Leonard McCoy",
  "mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n": "Jonathan Archer",
  "2N1SP7r92ZZJvYKG2oNtzPwYnzw62up7mTo": "Jadzia Dax",
  "mutrAf4usv3HKNdpLwVD4ow2oLArL6Rez8": "Montgomery Scott",
  "miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM": "James T. Kirk",
  "mvcyJMiAcSXKAEsQxbW9TYZ369rsMG6rVV": "Spock"
}

const readCustomerTxDeposits = (req, res, db) => {
  let arrMessages = '\n';
  Object.keys(customerHashMap).map((hash, index) => {
    let numOfTransactions;
    db.query({
      text: `SELECT count(id), sum(amount) FROM transactions
             WHERE address = $1
             AND category = $2`,
      values: [hash, 'receive']
    }).then(info => {
      numOfTransactions = info.rows[0].count;
      let sum = 0;
      sum = info.rows[0].sum.toPrecision(8);
      arrMessages += `Deposited for ${customerHashMap[hash]}: count=${numOfTransactions} sum=${sum}\n`;
      if (index === Object.keys(customerHashMap).length - 1) {
        db.query({
          text: `SELECT count(id), sum(amount) FROM transactions
                  WHERE confirmations <= $1
                  AND address IN ($2, $3, $4, $5, $6, $7, $8)`,
          values: [5, ...Object.keys(customerHashMap)]
        })
        .then(wOutRef => {
          const w_out_ref_deposits = wOutRef.rows[0].count;
          const sum_w_out_ref_deposits = wOutRef.rows[0].sum.toPrecision(8);

          db.query({
            text: `SELECT amount FROM transactions
                   WHERE confirmations >= $1
                   AND amount > $2
                   ORDER BY amount DESC`,
            values: [6, 0]
          })
          .then(minAndMax => {
            arrMessages += `Deposited without reference: count=${w_out_ref_deposits} sum=${sum_w_out_ref_deposits}\n`;
            arrMessages += `Smallest valid deposit: ${dissolveExponentialNotation(minAndMax.rows[minAndMax.rows.length - 1].amount)}\n`;
            arrMessages += `Largest valid deposit: ${minAndMax.rows[0].amount}\n\n`;
            res.status(200).send(arrMessages);
          })
          .catch(minMaxErr => {let a = ''});

        })
        .catch(wOutRefErr => {let a = ''});
      }
    })
    .catch(error => {let a = ''});
  });
}

module.exports = {
  readCustomerTxDeposits
}
