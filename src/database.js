const mysql = require("mysql");
const { promisify } = require("util");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "blogdb",
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
