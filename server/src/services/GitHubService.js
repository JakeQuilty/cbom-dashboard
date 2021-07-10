const Logger = require("../loaders/logger");
const { Octokit } = require("octokit");

module.exports = class GitHubService {
    async validateToken(authToken){
        Logger.debug("Validating token...");
        try{
            const octokit = await getOctokit(authToken);
            let result = await octokit.rest.users.getAuthenticated();
            if (result.status == 200){
                Logger.debug(`user:${result.data.login} token verified`);
                return true;
            } else {
                Logger.debug("Unknown result");
                Logger.debug(result);
                return false;
            }
        }catch (error) {
            if (error.status == 401) {
                Logger.debug(`Unable to validate OAuth Token is valid`);
                return false;
            } else {
                Logger.debug(`Error validating token`);
                throw error;
            }
        }
    }

    async validateOrg(authToken, orgName){
        Logger.debug(`Validating org: ${orgName}...`);
        try{
            const octokit = await getOctokit(authToken);
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

    async getOrgGithubID(authToken, orgName){
        try {
            const octokit = await getOctokit(authToken);
            let result = await octokit.rest.orgs.get({
                org: orgName
            });
            if (result.status == 200){
                Logger.debug(`org:${orgName} GitHub ID retrieval: success`);
                return result.data.id;
            }
            else{
                Logger.error("Unknown result on GitHub ID retrieval\n", result);
                throw new Error("Unknown result on GitHub ID retrieval");
            }
        }catch (error) {
            if (error.status == 404) {
                Logger.error(`org:${orgName} GitHub ID retrieval: fail\nMake sure to use validateOrg() first`);
                throw error;
            }
            else {
                Logger.error(`Error retrieving GitHub ID`);
                throw error;
            }

        }
    }

    /*
    Retrieves a list of all repos in the provided organization
    Params:
        - orgName: name of GitHub organization
        - authToken: GitHub OAuth Token
    Returns:
        Array of repos with name and default branch in the provided org
    */
    async getOrgReposList(params){
        // check for missing params
        if (
            params.orgName === undefined || 
            params.authToken === undefined) {
            let e = 'getOrgReposList() called without valid params';

            // redact authToken from logs
            if (params.authToken !== undefined) {
                params.authToken = "NOT UNDEFINED - VALUE REDACTED"
            }
            Logger.error(e + `orgName: ${params.orgName}\nauthToken: ${params.authToken}`);
            throw new Error(e);
        }

        const repos = [];
        // might need to move this out and send in this data as a param if I need
        // the repo data for other things too. Don't call getOrgAllReposData() twice.
        await getOrgAllReposData(params.orgName, params.authToken)
        .then(function(result){
            result.forEach(element => {
                let repo = {
                    name: element.name,
                    branch: element.default_branch
                }
                repos.push(repo);
            });
        });

        return repos;
    }

    async getRepoFilesList(params){
        
    }
}

async function getOrgAllReposData(orgName, authToken) {
    const octokit = await getOctokit(authToken);
     return await octokit.paginate(
        octokit.rest.repos.listForOrg,
        {
            org: orgName,
            per_page: 100   
        }
    );
}

async function getOctokit(authToken){
    return new Octokit({
        auth: "token " + authToken,
        throttle: {
          onRateLimit: (retryAfter, options) => {
            octokit.log.warn(
              `Request quota exhausted for request ${options.method} ${options.url}`
            );
      
            // Retry twice after hitting a rate limit error, then give up
            if (options.request.retryCount <= 2) {
              console.log(`Retrying after ${retryAfter} seconds!`);
              return true;
            }
          },
          onAbuseLimit: (retryAfter, options) => {
            // does not retry, only logs a warning
            octokit.log.warn(
              `Abuse detected for request ${options.method} ${options.url}`
            );
          },
        },
      });
}