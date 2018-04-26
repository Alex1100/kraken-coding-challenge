require('dotenv').load();
const axios = require('axios');
const pg = require('pg');
const db = new pg.Client(process.env.DB_URL);

db.connect((err) => {
  if (err) throw err;
  db.query({text: `SELECT count(id) FROM transactions`, values: []}).then(amount => {
    if (amount.rows[0].count >= 320) {
      axios.get('http://localhost:5000/data').then(fin => {
        console.log(fin.data)
        process.exit(0);
      });
    } else {
      axios.get('http://localhost:5000/save').then(info => {
        let nullPromiseHandle = '';
      });
    }
  })
});


module.exports = {
  db
}
