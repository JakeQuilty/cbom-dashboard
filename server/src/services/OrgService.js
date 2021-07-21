const Logger = require("../loaders/logger");
const config = require("../config");
const { encrypt, decrypt, base64enc, base64dec } = require('../utils/crypto.util');

const dbRows = {
    org_id: config.dbTables.organization.org_id,
    user_id: config.dbTables.organization.user_id,
    org_name: config.dbTables.organization.org_name,
    auth_token: config.dbTables.organization.auth_token,
    gh_id: config.dbTables.organization.gh_id,
    avatar_url: config.dbTables.organization.avatar_url,
    num_repos: config.dbTables.organization.num_repos,
    num_deps: config.dbTables.organization.num_deps
}

module.exports = class OrgService {
    constructor(GitHubService, DatabaseModels, RepoService){
        // https://www.npmjs.com/package/typedi ??
        this.ghService = GitHubService;
        this.models = DatabaseModels;
        this.repoService = RepoService;
    }
    
    /**
     * Creates an organization in the database
     * @param {Object} params orgName, authToken, userID, ghID, avatar
     * @returns Org data
     */
    async create(params) {
        try {
            //check params
            const schema = require('../utils/schema/schema.OrgService.create');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("OrgService.create() called with invalid parameters", error);
            // don't want to send this real error back to the user
            throw new Error (config.ERROR_MESSAGES.internal);
        }

        Logger.debug(`Creating Org: ${params.orgName}`);

        const encryptedToken = encrypt(params.authToken);
        const base64AvatarURL = base64enc(params.avatar);

        let org = await this.models.Organization.findOrCreate({
            where: {
                [dbRows.org_name]: params.orgName,
                [dbRows.user_id]: params.userID
            },
            defaults: {
                [dbRows.gh_id]: params.ghID,
                [dbRows.auth_token]: encryptedToken,
                [dbRows.avatar_url]: base64AvatarURL
            }
        });

        // seperate created value from data
        let create = org[1];
        org = org[0];

        Logger.info(`Org:${params.orgName} added succesfully`);
        return org;
    }

    /**
     * Scans an organization for all dependencies
     * @param {Object} params orgName, userID, authToken, repoList, orgID
     * @returns An Object with orgName, and an array of failures
     */
    async scan(params) {

        let failures = [];

        Logger.debug(`Beginning repo scans`);
        for (const repo of params.repoList){
            try {
                let repoData = await this.repoService.create({
                    repoName: repo.name,
                    orgID: params.orgID,
                    defaultBranch: repo.branch
                });

                // 1 API req per repo
                const fileTree = await this.repoService.getFileList({
                    orgName: params.orgName,
                    repoName: repo.name,
                    defaultBranch: repo.branch,
                    authToken: params.authToken
                });

                let failedFiles = this.repoService.scan({
                    repoID: repoData[config.dbTables.repository.repo_id],
                    fileTree: fileTree,
                    orgName: params.orgName,
                    repoName: repo.name,
                    authToken: params.authToken
                });
                
                // append files that failed to scan to failures
                if (Object.entries(failedFiles).length > 0){
                    failures.push({
                        repo: repo.name,
                        files: failedFiles,
                        scanned: true,
                        error: null
                    });
                }
            } catch (error) {
                Logger.error(`Failure to scan - Repo: ${repo.name}`, error);
                failures.push({
                    repo: repo.name,
                    files: {},
                    scanned: false,
                    error: error
                });
            }
        }

        // return scan data on a different list endpoint
        // can be used when rendering in a user that already has data in db
        for (const fail in failures){   ////////////////
            console.log(fail);
            console.log(JSON.stringify(fail));  ///////////////////////
        }
        Logger.info(`Org: ${params.orgName} scanned successfully`);
        return {orgName: params.orgName, failures: failures};
    }

    // userID
    async list(params) {
        console.log(process.env.DB_ADDRESS)
        const orgs = await this.models.Organization.findAll({
            where: {
                [dbRows.user_id]: params.userID
            }
        });

        let orgList = []
        for (const org of orgs) {
            orgList.push({
                id: org.dataValues[dbRows.org_id],
                name: org.dataValues[dbRows.org_name],
                avatar: org.dataValues[dbRows.avatar_url],
                numRepos: org.dataValues[dbRows.num_repos],
                numDeps: org.dataValues[dbRows.num_deps]
            });
        }

        return orgList
    }

    /**
     * Validates the existence of a GitHub Organization
     * @param {string} orgName 
     * @param {string} authToken 
     * @returns true or false
     */
    async validateOrg(orgName, authToken) {
        Logger.debug(`Validating org: ${orgName}...`);
        try{
            const octokit = await this.ghService.getOctokit(authToken);
            let result = await octokit.rest.orgs.get({
                org: orgName
            });
            if (result.status == 200){
                Logger.debug(`org:${orgName} verified`);
                return true;
            }
            else{
                Logger.error("Unknown result\n", result);
                return false;
            }
        } catch (error) {
            if (error.status == 404) {
                Logger.error(`Unable to validate org:${orgName} exists`);
                return false;
            } else {
                Logger.error(`Error validating org:${orgName}`);
                throw error;
            }
        }
    }

    /**
     * Gets the GitHub data for the Org
     * @param {string} orgName 
     * @param {string} authToken 
     * @returns github id and avatar_url
     */
    async getGithubData(orgName, authToken) {
        try {
            const octokit = await this.ghService.getOctokit(authToken);
            let result = await octokit.rest.orgs.get({
                org: orgName
            });
            if (result.status == 200){
                Logger.debug(`org:${orgName} GitHub Data: success`);
                return {id: result.data.id, avatarUrl: result.data.avatar_url};
            }
            else{
                Logger.error("Unknown result on GitHub ID retrieval\n", result);
                throw new Error("Unknown result on GitHub ID retrieval");
            }
        }catch (error) {
            if (error.status == 404) {
                Logger.error(`org:${orgName} GitHub ID retrieval: fail`);
                return null;
            }
            else {
                Logger.error(`Error retrieving GitHub ID`);
                throw error;
            }

        }
    }

    /**
     * Retrieves an organization from the database
     * @param {string} orgName 
     * @param {string} userID 
     * @returns organization with decrypted oauth token
     */
    async retrieve(orgName, userID) {
        Logger.debug("Retrieving org from db");

        try {
            let org = await this.models.Organization.findOne({
                where: {
                    [config.dbTables.organization.org_name]: orgName,
                    [config.dbTables.organization.user_id]: userID
                }
            });

            if (org === null) return null;

            Logger.debug('Decrypting OAuth Token...');
            let decryptedToken = decrypt(org[dbRows.auth_token]);
            org[dbRows.auth_token] = decryptedToken;

            Logger.debug('Decoding Avatar URL...');
            let decodedURL = base64dec(org[dbRows.avatar_url]);
            org[dbRows.avatar_url] = decodedURL;

            return org;
        } catch (error) {
            Logger.error("OrgService.retrieve() failed: ", error);
            throw error;
        }
    }

    /**
     * Retrieves a list of all repos in the organization
     * @param {string} orgName 
     * @param {string} authToken 
     * @returns Array of Objects with name and default branch of repos
     */ 
    async getRepoList(orgName, authToken) {
        Logger.debug(`Getting repo list for org ${orgName}`);

        try {
            const octokit = await this.ghService.getOctokit(authToken);

            const repos = [];
            await octokit.paginate(
                octokit.rest.repos.listForOrg,
                {
                    org: orgName,
                    per_page: 100   
                }
            ).then(function(result){
                result.forEach(element => {
                    let repo = {
                        name: element.name,
                        branch: element.default_branch
                    }
                    repos.push(repo);
                });
            });
            return repos;

        } catch (error) {
            Logger.error('OrgService.getRepoList() failed:', error);
            throw error;
        }
    }
}

/*
Keep this in mind for get all dependencies
https://sequelize.org/v4/manual/installation/getting-started.html at the bottom: Promises
http://bluebirdjs.com/docs/api/promise.all.html
*/
