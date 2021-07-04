const Logger = require("../loaders/logger");
const { Octokit } = require("@octokit/rest");

module.exports = class GitHubService {
    async validateToken(authToken){
        console.log("Validating token...");
        try{
            const octokit = new Octokit({
                auth: `token ${authToken}`
            }); 
            let result = await octokit.rest.users.getAuthenticated();
            if (result.status == 200){
                console.log(`user:${result.data.login} token verified`);
                return true;
            } else {
                console.log("Unknown result");
                console.log(result);
                return false;
            }
        }catch (error) {
            if (error.status == 401) {
                console.log(`Unable to validate OAuth Token is valid`);
                return false;
            } else {
                console.log(`Error validating token`);
                throw error;
            }
        }
    }

    async validateOrg(authToken, name){
        Logger.debug(`Validating org: ${name} exists...`);
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
}