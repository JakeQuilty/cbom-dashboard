const GitHubService = require("./GitHubService");
const DBHelper = require("../db/DBHelper");
const Logger = require("../loaders/logger");

module.exports = class OrgService {
    
    async CreateNewOrg(org){
        const name = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

        // make sure token and org are valid
        if (!await GitHubService.validateToken(ghAuthToken)){
            Logger.debug('User sent an invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
            return {status: 401, data: {message: "invalid token"}};
        }
        if (!await GitHubService.validateOrg(ghAuthToken, name)){
            Logger.debug("User sent an invalid org");
            return {status: 404, data: {message: "invalid organization"}};
        }

        // check if org is duplicate
        if (await DBHelper.existsInDB({
            name: name,
            userID: userID
        })){
            Logger.debug("Organization already exists in database");
            return {status: 409, data: {message: "organization already exists"}};
        }

        await DBHelper.orgCreateEntry({
            name: name,
            userID: userID,
            token: ghAuthToken,
            githubID: await GitHubService.getOrgGithubID(ghAuthToken, name)
        })

        return {status: 200, data: {name: name}}
        
        


    }

}