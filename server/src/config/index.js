process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    port: 3080, //parseInt(process.env.PORT, 10)
    api: {
        prefix: '/api',
    },

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
        queueLimit: 0,
    },

    dbTables: {
        organization:{
            name: "organization",
            org_id: "org_id",
            gh_id: "gh_id",
            org_name: "org_name",
            auth_token: "auth_token",
            user_id: "user_id"
        }
    }
}