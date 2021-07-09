const Logger = require("../loaders/logger");

// for tests do an
    // if test env: these get mock functions
    // else load these real ones
const GitHubService = require("./GitHubService");
const DatabaseService = require("./DatabaseService");
const config = require("../config");

const ghService = new GitHubService();
const dbService = new DatabaseService();

module.exports = class OrgService {
    
    async CreateNewOrg(org){
        var orgName = org.name;
        var ghAuthToken = org.ghAuthToken;
        var userID = org.userID;

        // make sure token and org are valid
        if (!await ghService.validateToken(ghAuthToken)){
            Logger.info('User sent an invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
            return {status: 401, data: {message: "invalid token"}};
        }
        if (!await ghService.validateOrg(ghAuthToken, orgName)){
            Logger.info("User sent an invalid org");
            return {status: 404, data: {message: "invalid organization"}};
        }

        // check if org is duplicate
        if (await dbService.orgExists({
            orgName: orgName,
            userID: userID
        })){
            Logger.info("Organization already exists in database");
            return {status: 409, data: {message: "organization already exists"}};
        }

        await dbService.orgCreateEntry({
            orgName: orgName,
            userID: userID,
            token: ghAuthToken,
            githubID: await ghService.getOrgGithubID(ghAuthToken, orgName)
        })
        Logger.info(`Org:${orgName} added succesfully`);

        return {status: 200, data: {name: orgName}}
    }

    async ScanOrg(org){
        var orgName = org.name;
        var userID = org.userID;

        // check if org exits in db - if not send error

        //get org data from db - DBHelper
        let orgData = await dbService.orgRetrieve({
            orgName: orgName,
            userID: userID
        });

        // validate token still works
        // validate org still exists

        // get list of org's repos - GitHubService
        let repoList = await ghService.getOrgReposList({
            authToken: orgData[[config.dbTables.organization.auth_token]],
            orgName: orgData[[config.dbTables.organization.org_name]]
        });
        console.log(repoList);

        // foreach repo
        //      get files
        //      foreach file
        //          see if file is a dep file
        //          if depfile, parse and store in db

        // return scan data on a different list endpoint
        // can be used when rendering in a user that already has data in db
        return {status: 200, data: {name: orgName}};
    }

}