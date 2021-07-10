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
        dialect: 'mysql',
        poolMax: 10,
        poolMin: 0,
        poolAcquire: 30000,
        poolIdle: 10000
    },

    dbTables: {
        user:{
            name: 'user',
            user_id: 'user_id',
            user_name: 'user_name',
            user_password: 'user_password',
            first_name: 'first_name',
            last_name: 'last_name',
            account_priv: 'account_priv'
        },
        organization:{
            name: "organization",
            org_id: "org_id",
            gh_id: "gh_id",
            org_name: "org_name",
            auth_token: "auth_token",
            user_id: "user_id"
        },
        repository:{
            name: 'repository',
            repo_id: 'repo_id',
            repo_name: 'repo_name',
            default_branch: 'default_branch',
            org_id: 'org_id'
        },
    },
    // if you don't like it. run in production mode.
    encryption: {
        key: process.env.ENCRYTPION_KEY || "DL2iak8NtdIl9cCidAS23cdDcI2p012z"
    }
}