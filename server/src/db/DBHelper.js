const Logger = require("../loaders/logger");
const config = require("../config");
const db = require('./mysql.js');

const dbTable = config.dbTables.organization.name;
const dbOrgID = config.dbTables.organization.org_id;
const dbOrgName = config.dbTables.organization.org_name;
const dbUserID = config.dbTables.organization.user_id;
const dbGHID = config.dbTables.organization.gh_id;
const dbAuthToken = config.dbTables.organization.auth_token;

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

        Logger.debug(`Checking if org: ${params.name} exists in db`);
        var sql = `SELECT 1 FROM ${dbTable} WHERE ${dbOrgName} = '${params.name}' AND ${dbUserID} = '${params.userID}' LIMIT 1;`;

        try {
            var result = await db.query(sql);
        } catch (error) {
            Logger.error("orgExists() failed on query\n", error);
            throw error;
        }

        // result.length > 0 means a list of results were returned
        // from db meaning it's a duplicate
        let len = result[0].length
        return (Boolean(len > 0));
    }

    /*
    creates an entry for the org in the database
    params - name, githubID, token, userID
    */
    async orgCreateEntry(params){
        if (
            params.name     === undefined || 
            params.userID   === undefined ||
            params.githubID === undefined ||
            params.token    === undefined){
            let e = 'orgCreateEntry() called without valid params';
            Logger.error(e + `\nname: ${params.name}\nuserID: ${params.userID}\ngithubID: ${params.githubID}\ntoken: ${params.token}`);
            throw new Error(e);
        }
        
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