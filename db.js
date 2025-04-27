const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'bugmcgo92jrbk9dpfewg-mysql.services.clever-cloud.com',
  user: 'umomjmz183jm4idy',
  password: 'm0NBeMzbt4SZ2BThNbPh',
  database: 'bugmcgo92jrbk9dpfewg'
});

db.connect(err => {
  if (err) console.error('DB connection error:', err);
  else console.log('MySQL connected!');
});

module.exports = db;
