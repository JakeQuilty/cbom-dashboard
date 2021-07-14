const Logger = require("../loaders/logger");
const config = require("../config");
const { isDepFile } = require("../utils/file.util");

// NEED TO MOVE ALL HTTP STUFF OUT OF THE SERVICE LAYER
// https://www.codementor.io/@evanbechtol/node-service-oriented-architecture-12vjt9zs9i
// https://softwareontheroad.com/ideal-nodejs-project-structure/#service


module.exports = class OrgService {
    constructor(GitHubService, DatabaseService){
        this.ghService = GitHubService;
        this.dbService = DatabaseService;
    }
    
    async CreateNewOrg(org){
        const orgName = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

        // ------------ SHOULD THIS BLOCK BE MIDDLEWARE?? ----------------
        // NO? - because you don't go from controller straight to dataccess layer?

        // make sure token and org are valid
        if (!await this.ghService.validateToken(ghAuthToken)){
            Logger.info('User sent an invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
            return {status: 401, data: {message: "invalid token"}};
        }
        if (!await this.ghService.validateOrg(ghAuthToken, orgName)){
            Logger.info("User sent an invalid org");
            return {status: 404, data: {message: "invalid organization"}};
        }

        // check if org is duplicate
        if (await this.dbService.orgExists({
            orgName: orgName,
            userID: userID
        })){
            Logger.info("Organization already exists in database");
            return {status: 409, data: {message: "organization already exists"}};
        }
        // -----------------------------------------------------------------

        // should use findOrCreate instead of checking for duplicate.
        // https://sequelize.org/v4/manual/tutorial/models-usage.html#-findorcreate-search-for-a-specific-element-or-create-it-if-not-available
        await this.dbService.orgCreateEntry({
            orgName: orgName,
            userID: userID,
            token: ghAuthToken,
            githubID: await this.ghService.getOrgGithubID(ghAuthToken, orgName)
        })
        Logger.info(`Org:${orgName} added succesfully`);

        return {status: 200, data: {name: orgName}}
    }

    async ScanOrg(org){
        const orgName = org.name;
        const userID = org.userID;

        // 
        // check if org exits in db
        if (!await this.dbService.orgExists({
            orgName: orgName,
            userID: userID
        })){
            Logger.info("Organization does not exist in database");
            return {status: 409, data: {message: "information for this organization does not exist"}};
        }

        //get org data from db - DBHelper
        let orgData = await this.dbService.orgRetrieve({
            orgName: orgName,
            userID: userID
        });
        const authToken = orgData[[config.dbTables.organization.auth_token]];
        const orgID = orgData[[config.dbTables.organization.org_id]];

        // validate token still works and org still exists
        if (!await this.ghService.validateToken(authToken)){
            Logger.info('Invalid token');
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
            return {status: 409, data: {message: "invalid token"}};
        }
        if (!await this.ghService.validateOrg(authToken, orgName)){
            Logger.info("Invalid org");
            return {status: 409, data: {message: "invalid organization"}};
        }

        // get list of org's repos - GitHubService
        let repos = await this.ghService.getOrgReposList({
            authToken: authToken,
            orgName: orgData[[config.dbTables.organization.org_name]]
        });

        // DO THIS BUT WITH REPO OBJECTS INSTEAD?

        // This is ugly, but since there is a ton of data I don't want to keep passing it back and forth
        for (const repo of repos){
            // make sure repo is not duplicate
            // this will double the db calls on initial org scan :/
            //
            // should use find or create instead
            // https://sequelize.org/v4/manual/tutorial/models-usage.html#-findorcreate-search-for-a-specific-element-or-create-it-if-not-available
            let repoID;
            if (!await this.dbService.repoExists({
                repoName: repo.name,
                orgID: orgID
            })){
                repoID = await this.dbService.repoCreateEntry({
                    repoName: repo.name,
                    defaultBranch: repo.branch,
                    orgID: orgID
                });
            } // else check if default branch needs to be updated while we have the info??? - extra db calls will make it slower

            const fileTree = await this.ghService.getRepoFilesList({ // 2 API reqs PER repo smh
                orgName: orgName,
                repoName: repo.name,
                defaultBranch: repo.branch,
                authToken: authToken
            });

            for (const file of fileTree){
                if (await isDepFile(file.type, file.path)){
                    console.log(file);
                    // pass to depservice to determine what kinda file and parse - return object of deps
                    // dbService - put all in db
                }

                // we need to check path for dep file and keep sha for pulling down the depfile blob
                // get blob only works with up to 100MB - check size before pulling?
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