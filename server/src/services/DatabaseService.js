const Logger = require("../loaders/logger");
const config = require("../config");
const { models } = require('../db');
const { encrypt, decrypt } = require('./CryptoService');

module.exports = class DatabaseService {

    /*
    Checks if an organization with the same name is owned by user with the supplied id
    Params:
        orgName - org name
        userID - DB userid
    Returns:
        true - user already has an org with that name
        false - not duplicate
    */
     async orgExists(params){
        if (
            params.orgName === undefined || 
            params.userID === undefined) {
            let e = 'orgExists() called without valid params';
            Logger.error(e + `\orgName: ${params.orgName}\nuserID: ${params.userID}`);
            throw new Error(e);
        }

        try {
            var result = await models.Organization.findAll({
                where: {
                    [config.dbTables.organization.org_name]: params.orgName,
                    [config.dbTables.organization.user_id]: params.userID
                },
                limit: 1
            });
        } catch (error) {
            Logger.error("orgExists() failed on query\n", error);
            throw error;
        }

        // result.length > 0 means a list of results were returned
        // from db meaning it's a duplicate
        let len = result.length
        return (Boolean(len > 0));
    }

    /*
    Creates an entry for the org in the database
    Params:
        orgName - org name
        userID - DB userid
        githubID - unique github id of org
        token - user's github oauth token
    Returns:
        auto-generated org db id
    */
    async orgCreateEntry(params){
        if (
            params.orgName     === undefined || 
            params.userID   === undefined ||
            params.githubID === undefined ||
            params.token    === undefined) {
            let e = 'orgCreateEntry() called without valid params';
            Logger.error(e + `\norgName: ${params.orgName}\nuserID: ${params.userID}\ngithubID: ${params.githubID}\ntoken: ${params.token}`);
            throw new Error(e);
        }

        Logger.debug('Encrypting OAuth Token...')
        var encryptedToken = encrypt(params.token);
        
        Logger.debug(`Adding org: ${params.orgName}:${params.githubID} to database...`)

        try {
            var org = await models.Organization.create({
                [config.dbTables.organization.gh_id]: params.githubID,
                [config.dbTables.organization.org_name]: params.orgName,
                [config.dbTables.organization.auth_token]: encryptedToken,
                [config.dbTables.organization.user_id]: params.userID
            })
        } catch (error) {
            Logger.error(`query to make new DB entry for org:${params.orgName} failed\n`, error);
            throw error;
        }
        return org.id;
    }

    /*
    Retrieves an org owned by userid from the database
    Params:
        name - org name
        userID - DB userid
    Returns:
        list of the org's database values, with the auth token decrypted
    */
    async orgRetrieve(params){
        if (
            params.orgName === undefined || 
            params.userID === undefined) {
            let e = 'orgRetrieve() called without valid params';
            Logger.error(e + `\orgName: ${params.orgName}\nuserID: ${params.userID}`);
            throw new Error(e);
        }

        Logger.debug(`Retrieving org:${params.orgName} from DB...`);
        let org = {}
        try {
            await models.Organization.findAll({
                where: {
                    [config.dbTables.organization.org_name]: params.orgName,
                    [config.dbTables.organization.user_id]: params.userID
                },
                limit: 1
            }).then(async function(result) {
                org = await dbResultToObject(result);
                Logger.debug('Decrypting OAuth Token...')
                let decryptedToken = decrypt(org[[config.dbTables.organization.auth_token]]);
                org[[config.dbTables.organization.auth_token]] = decryptedToken;
            });
        } catch (error) {
            Logger.error("orgRetrieve() failed on query\n", error);
            throw error;
        }

        return org;
    }
};

async function dbResultToObject(dbResult){
    let resultObject = {}
    for (const [key, value] of Object.entries(dbResult[0].dataValues)) {
        resultObject[key] = value;
    }
    return resultObject;
}