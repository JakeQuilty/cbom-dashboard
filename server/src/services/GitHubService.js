const Logger = require("../loaders/logger");
const { Octokit } = require("@octokit/rest");

module.exports = class GitHubService {
    async validateToken(authToken){
        Logger.debug("Validating token...");
        try{
            const octokit = new Octokit({
                auth: `token ${authToken}`
            }); 
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

    async validateOrg(authToken, name){
        Logger.debug(`Validating org: ${name}...`);
        try{
            const octokit = new Octokit({
                auth: `token ${authToken}`
            });
            let result = await octokit.rest.orgs.get({
                org: name
            });
            if (result.status == 200){
                Logger.debug(`org:${name} verified`);
                return true;
            }
            else{
                Logger.error("Unknown result\n", result);
                return false;
            }
        } catch (error) {
            if (error.status == 404) {
                Logger.error(`Unable to validate org:${name} exists`);
                return false;
            } else {
                Logger.error(`Error validating org:${name}`);
                throw error;
            }
        }
        
    }

    async getOrgGithubID(authToken, name){
        try {
            const octokit = new Octokit({
                auth: `token ${authToken}`
                });
            let result = await octokit.rest.orgs.get({
                org: name
            });
            if (result.status == 200){
                Logger.debug(`org:${name} GitHub ID retrieval: success`);
                return result.data.id;
            }
            else{
                Logger.error("Unknown result on GitHub ID retrieval\n", result);
                throw new Error("Unknown result on GitHub ID retrieval");
            }
        }catch (error) {
            if (error.status == 404) {
                Logger.error(`org:${name} GitHub ID retrieval: fail\nMake sure to use validateOrg() first`);
                throw error;
            }
            else {
                Logger.error(`Error retrieving GitHub ID`);
                throw error;
            }

        }
    }
    
    async getReposList(){
        var repos;
        const octokit = new Octokit({
            auth: `token ${this.token}`
          });
        for await (const response of octokit.paginate(octokit.rest.repos.listForOrg({
            org: this.name,
            per_page: 100
        })
        )) {
            response.forEach(element => {
                repos.append(element.name)
            });
        }
        return repos;
    }
}