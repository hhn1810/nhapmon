const mysql = require("mysql");
const { promisify } = require("util");
require("dotenv").config();
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: "",
  database: process.env.DATABASE,
});

pool.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  if (connection) connection.release();
  console.log("Kết nối database thành công");
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;
