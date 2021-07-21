process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    port: 3080, //parseInt(process.env.PORT, 10)
    api: {
        prefix: '/api',
    },

    //https://www.npmjs.com/package/winston#logging-levels
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
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
        user: {
            name: 'user',
            user_id: 'user_id',
            user_name: 'user_name',
            user_password: 'user_password',
            first_name: 'first_name',
            last_name: 'last_name',
            account_priv: 'account_priv'
        },
        organization: {
            name: "organization",
            org_id: "org_id",
            gh_id: "gh_id",
            org_name: "org_name",
            auth_token: "auth_token",
            user_id: "user_id",
            avatar_url: "avatar_url",
            num_repos: "num_repos",
            num_deps: "num_deps"
        },
        repository: {
            name: 'repository',
            repo_id: 'repo_id',
            repo_name: 'repo_name',
            default_branch: 'default_branch',
            org_id: 'org_id'
        },
        fileType: {
            name: "file_type",
            type_id: "type_id",
            language_name: "language_name"
        },
        dependencyFile: {
            name: 'dependency_file',
            depfile_id: 'depfile_id',
            file_name: 'file_name',
            file_path: 'file_path',
            repo_id: 'repo_id',
            type_id: 'type_id'
        },
        dependency: {
            name: 'dependency',
            dep_id: 'dep_id',
            dep_name: 'dep_name',
            dep_version: 'dep_version',
            scan_date: 'scan_date',
            depfile_id: 'depfile_id'
        }
    },
    // please set your own.... this is just for testing
    encryption: {
        key: process.env.ENCRYTPION_KEY || "DL2iak8NtdIl9cCidAS23cdDcI2p012z"
    },

    ERROR_MESSAGES: {
        internal: "Internal Server Error",
        invalid_token: "Invalid GitHub OAuth Token",
        invalid_org: "Invalid GitHub Organization",
        org_does_not_exist: "Organization not in database"
    }
}