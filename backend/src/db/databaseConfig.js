// in that connect databse to our server

//write here configuration

const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("DB CONNECTION FAILED:", err.message);
    return;
  }
  console.log("DB CONNECTED SUCCESFULLY");
  connection.release();
});

module.exports = db;

