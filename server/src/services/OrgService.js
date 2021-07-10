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
        const orgName = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

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
        const orgName = org.name;
        const userID = org.userID;

        // 
        // check if org exits in db
        if (!await dbService.orgExists({
            orgName: orgName,
            userID: userID
        })){
            Logger.info("Organization does not exist in database");
            return {status: 409, data: {message: "information for this organization does not exist"}};
        }

        //get org data from db - DBHelper
        let orgData = await dbService.orgRetrieve({
            orgName: orgName,
            userID: userID
        });
        const authToken = orgData[[config.dbTables.organization.auth_token]];
        const orgID = orgData[[config.dbTables.organization.org_id]];

        // validate token still works and org still exists
        if (!await ghService.validateToken(authToken)){
            Logger.info('Invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
            return {status: 409, data: {message: "invalid token"}};
        }
        if (!await ghService.validateOrg(authToken, orgName)){
            Logger.info("Invalid org");
            return {status: 409, data: {message: "invalid organization"}};
        }

        // get list of org's repos - GitHubService
        let repos = await ghService.getOrgReposList({
            authToken: authToken,
            orgName: orgData[[config.dbTables.organization.org_name]]
        });

        for (const repo of repos){
            // make sure repo is not duplicate
            // this will double the db calls on initial org scan :/
            let repoID;
            if (!await dbService.repoExists({
                repoName: repo.name,
                orgID: orgID
            })){
                repoID = await dbService.repoCreateEntry({
                    repoName: repo.name,
                    defaultBranch: repo.defaultBranch,
                    orgID: orgID
                });
            }
        }
        

        // foreach repo
        //      check if repo exists in db
        //      store in db - keep track of id
        //      get files - githubservice
        //      foreach file
        //          see if file is a dep file - scan service? has parsers and scans for dep filess
        //          if depfile, parse and store in db

        // return scan data on a different list endpoint
        // can be used when rendering in a user that already has data in db
        return {status: 200, data: {name: orgName}};
    }

}