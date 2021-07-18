const Logger = require("../loaders/logger");
const { Octokit } = require("octokit");

// Each authenticated token gets 5000 requests an hour

module.exports = class GitHubService {

    async getOctokit(authToken){
        return new Octokit({
            auth: "token " + authToken,
            throttle: {
              onRateLimit: (retryAfter, options) => {
                octokit.log.warn(
                  `Request quota exhausted for request ${options.method} ${options.url}`
                );
          
                // Retry twice after hitting a rate limit error, then give up
                if (options.request.retryCount <= 2) {
                  Logger.info(`Retrying after ${retryAfter} seconds!`);
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

    async validateToken(authToken){
        Logger.debug("Validating token...");
        try{
            const octokit = await this.getOctokit(authToken);
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
}