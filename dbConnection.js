const mysql = require("mysql2");

// create pool or connection
exports.promisPool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Whddnjs92!",
    database: "sql-primer",
  })
  .promise();
