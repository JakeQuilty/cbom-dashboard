const GitHubService = require("./GitHubService");
const DatabaseService = require("./DatabaseService");
const Logger = require("../loaders/logger");

module.exports = class OrgService {
    
    async CreateNewOrg(org){
        const orgName = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

        // for tests do an
        // if test env: these get mock functions
        // else load these real ones
        const ghService = new GitHubService();
        const dbHelper = new DatabaseService();

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
        if (await dbHelper.orgExists({
            orgName: orgName,
            userID: userID
        })){
            Logger.info("Organization already exists in database");
            return {status: 409, data: {message: "organization already exists"}};
        }

        await dbHelper.orgCreateEntry({
            orgName: orgName,
            userID: userID,
            token: ghAuthToken,
            githubID: await ghService.getOrgGithubID(ghAuthToken, orgName)
        })
        Logger.info(`Org:${orgName} added succesfully`);

        return {status: 200, data: {name: orgName}}
        
        


    }

    async ScanOrg(org){
        // get org data from db - DBHelper
        // get list of org's repos - GitHubService
        // foreach repo
        //      get files
        //      foreach file
        //          see if file is a dep file
        //          if depfile, parse and store in db
    }

}