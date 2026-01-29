const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Or your MySQL server IP
  user: "root",      // Your MySQL username
  password: "",      // Your MySQL password
  database: "tvet",  // The name of your database in phpMyAdmin
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected to the MySQL database.");
  connection.release();
});

module.exports = pool.promise(); // Export a promise-wrapped pool