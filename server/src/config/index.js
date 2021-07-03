process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
    port: 3080, //parseInt(process.env.PORT, 10)

    //https://www.npmjs.com/package/winston#logging-levels
    logs: {
        level: process.env.LOG_LEVEL || 'debug',
    },
    
    mysql: {
        address: process.env.DB_ADDRESS,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit:0,
    },
}