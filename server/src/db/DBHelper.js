const Logger = require("../loaders/logger");
const config = require("../config");
const db = require('./mysql.js');

module.exports = class DBHelper {

    /*
     checks if an organization with the same name is owned by user with the supplied id
     true - user already has an org with that name
     false - not duplicate
     expects params name and userID
    */
     async orgExists(params){
        if (params.name === undefined || params.userID === undefined){
            let e = 'orgExists() called without valid params';
            Logger.error(e + `\nname: ${params.name}\nuserID: ${params.userID}`);
            throw new Error(e);
        }

        // names of the tables in the db
        dbTable = config.dbTables.organization.name;
        dbOrgName = config.dbTables.organization.org_name;
        dbUserID = config.dbTables.organization.user_id;

        Logger.debug(`Checking if org: ${params.name} exists in db`);
        var sql = `SELECT 1 FROM ${dbtable} WHERE ${dbOrgName} = '${params.name}' AND ${dbUserID} = '${params.userID}' LIMIT 1;`;

        try {
            var result = await db.query(sql);
        } catch (error) {
            Logger.error("orgExists() failed on query\n", error);
            throw error;
        }

        // result.length > 0 means a list of results were returned
        // from db meaning it's a duplicate
        let len = result[0].length
        console.log(len);
        return (Boolean(len > 0));
    }

    /*
    creates an entry for the org in the database
    params - name, githubID, token, userID
    */
    async orgCreateEntry(params){
        // names of the tables in the db
        dbTable = config.dbTables.organization.name;
        dbOrgName = config.dbTables.organization.org_name;
        dbUserID = config.dbTables.organization.user_id;
        dbGHID = config.dbTables.organization.gh_id;
        dbAuthToken = config.dbTables.organization.auth_token;

        Logger.debug(`Adding org: ${params.name}:${params.githubID} to database...`)
        
        // Here we are putting user inputs into a SQL command.
        // I think we are okay, because we validate they are GH orgs and tokens first.
        // need to figure out way to encrypt and decrypt token
        // this needs work
        var sql = `INSERT INTO ${dbTable} (${dbGHID}, 
        ${dbOrgName}, ${dbAuthToken}, ${dbUserID}) 
        VALUES (${params.githubID}, '${params.name}', '${params.token}', ${params.userID})`;
        
        try {
            await db.query(sql);
        } catch (error) {
            Logger.error(`query to make new DB entry for org:${params.name} failed\n`, error);
            throw error;
        }
    }

}