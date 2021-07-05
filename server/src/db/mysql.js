const mysql = require('mysql2');
const config = require('../config');

const dbConfig = {
    host: config.mysql.address,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    waitForConnections: config.mysql.waitForConnections,
    connectionLimit: config.mysql.connectionLimit,
    queueLimit: config.mysql.queueLimit
}

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;