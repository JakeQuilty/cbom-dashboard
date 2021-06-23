const mysql = require('mysql2');

const dbConfig = {
    host: process.env.DB_ADDRESS,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit:0
}

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;