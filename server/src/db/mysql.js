const mysql = require('mysql2');
const config = require('../config');

const dbConfig = {
    host: config.address,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: config.waitForConnections,
    connectionLimit: config.connectionLimit,
    queueLimit: config.queueLimit
}

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;