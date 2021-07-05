const GitHubService = require("./GitHubService");
const DBHelper = require("../db/DBHelper");
const Logger = require("../loaders/logger");
// const {Service} = require("typedi");

// @Service();
module.exports = class OrgService {
    
    async CreateNewOrg(org){
        const name = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

        const ghService = new GitHubService();
        const dbHelper = new DBHelper();

        // make sure token and org are valid
        if (!await ghService.validateToken(ghAuthToken)){
            Logger.info('User sent an invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
            return {status: 401, data: {message: "invalid token"}};
        }
        if (!await ghService.validateOrg(ghAuthToken, name)){
            Logger.info("User sent an invalid org");
            return {status: 404, data: {message: "invalid organization"}};
        }

        // check if org is duplicate
        if (await dbHelper.orgExists({
            name: name,
            userID: userID
        })){
            Logger.info("Organization already exists in database");
            return {status: 409, data: {message: "organization already exists"}};
        }

        await dbHelper.orgCreateEntry({
            name: name,
            userID: userID,
            token: ghAuthToken,
            githubID: await ghService.getOrgGithubID(ghAuthToken, name)
        })
        Logger.info(`Org:${name} added succesfully`);

        return {status: 200, data: {name: name}}
        
        


    }

}