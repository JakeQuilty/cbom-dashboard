const Logger = require("../loaders/logger");
const config = require("../config");

// NEED TO MOVE ALL HTTP STUFF OUT OF THE SERVICE LAYER
// https://www.codementor.io/@evanbechtol/node-service-oriented-architecture-12vjt9zs9i
// https://softwareontheroad.com/ideal-nodejs-project-structure/#service


module.exports = class OrgService {
    constructor(GitHubService, DatabaseService, RepoService){
        // https://www.npmjs.com/package/typedi ??
        this.ghService = GitHubService;
        this.dbService = DatabaseService;
        this.repoService = RepoService;
    }
    
    async CreateNewOrg(org){
        const orgName = org.name;
        const ghAuthToken = org.ghAuthToken;
        const userID = org.userID;

        // ------------ SHOULD THIS BLOCK BE MIDDLEWARE?? ----------------
        // NO? - because you don't go from controller straight to dataccess layer?
        // YES? - is middleware considered service layer enough to do that?

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

        return {status: 200, data: {name: orgName}};
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

        for (const repo of repos){
            let repoData = await this.repoService.create({
                repoName: repo.name,
                orgID: orgID,
                defaultBranch: repo.branch
            });

            const fileTree = await this.repoService.getFilesList({ // 2 API reqs PER repo smh
                orgName: orgName,
                repoName: repo.name,
                defaultBranch: repo.branch,
                authToken: authToken
            });

            this.repoService.scan(repoData[config.dbTables.repository.repo_id], fileTree);
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