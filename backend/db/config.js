const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // or your MySQL password
  database: 'inpt_field_booking',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ' + connection.threadId);
});

module.exports = connection;
