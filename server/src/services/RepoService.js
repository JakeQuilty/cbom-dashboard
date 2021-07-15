const config = require('../config');
const Logger = require('../loaders/logger');

const dbRow = {
    repo_name: config.dbTables.repository.repo_name,
    org_id: config.dbTables.repository.org_id,
    default_branch: config.dbTables.repository.default_branch
}

module.exports = class RepoService {
    constructor (GitHubService, DatabaseModels, DepedencyFileService) {
        this.ghService = GitHubService;
        this.models = DatabaseModels;
        this.dfService = DepedencyFileService;
    }

    /**
     * Creates a repo in the database if it doesn't already exist
     * and updates the default branch if it is out of date
     * @param {number} orgID
     * @param {string} repoName
     * @param {string} defaultBranch
     * @returns Object of created repo
     * ex: {"repo_id":226,"default_branch":"master","repo_name":"autoparse","org_id":7}
     */
    async create(params) {
        try {
            //check params
            const schema = require('../utils/schema/schema.RepoService.create');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("RepoServices.create() called with invalid parameters");
            throw error;
        }

        // create only if repo doesn't already exist
        try {
            let repo = await this.models.Repository.findOrCreate({
                where: {
                    [dbRow.repo_name]: params.repoName,
                    [dbRow.org_id]: params.orgID
                },
                defaults: {
                    [dbRow.default_branch]: params.defaultBranch
                }
            });

            // split repo data from if-created value
            let created = repo[1];
            repo = repo[0];

            // update main branch if it's outdated
            let currDefBranch = repo[dbRow.default_branch];
            if (!created && currDefBranch !== params.defaultBranch) {
                 return await this.models.Repository.update({
                    [dbRow.default_branch]: params.defaultBranch
                }, {
                    where: {
                        [dbRow.repo_name]: params.repoName,
                        [dbRow.org_id]: params.orgID
                    }
                });
            }
            return repo;

        } catch (error) {
            Logger.error("RepoService.create() failed");
            throw error;
        }
    }

    /**
     * Scans a repository
     * @param {number} repoID 
     * @param {Object} fileTree 
     * @returns idk yet maybe nothing
     */
    async scan(repoID, fileTree) {
        //check params
        try {
            const schema = require('../utils/schema/schema.RepoService.scan');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("RepoServices.create() called with invalid parameters");
            throw error;
        }

        for (const file of fileTree){
            if (!await this.dfService.isDepFile(file.type, file.path)){
                continue;
            }
            // get file language and parser
            let { language, parser } = await this.dfService.determineLanguage(file.path);
            // get file_type id with language
            let typeID = await this.dfService.getLanguageID()
            // create
            let depFileData = this.dfService.create({
                repoID: repoID,
                fileTypeID: typeID,
                filePath: file.path,
            });
            //get blob
            //parse
            //scan

            // we need to check path for dep file and keep sha for pulling down the depfile blob
            // get blob only works with up to 100MB - check size before pulling?
        }

        return true;
    }

    /**
     * Retrieves a list of all the files in a repo
     * @param {string} orgName
     * @param {string} repoName
     * @param {string} defaultBranch
     * @param {string} authToken
     * @returns Array of strings of the file names
    */
    async getFileList(params) {
        //check params
        try {
            const schema = require('../utils/schema/schema.RepoService.getFileList');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("RepoServices.create() called with invalid parameters");
            throw error;
        }

        const octokit = await this.ghService.getOctokit();
        try {
            // if truncated = true, we're missing files
            // https://docs.github.com/en/rest/reference/git#get-a-tree
            const commitData = await octokit.request('GET /repos/{owner}/{repo}/commits/{default_branch}', {
                owner: params.orgName,
                repo: params.repoName,
                default_branch: params.defaultBranch
              });

            const sha = commitData.data.sha;

            const result = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=true', {
                owner: params.orgName,
                repo: params.repoName,
                tree_sha: sha
              });
            
            return result.data.tree;

        } catch (error) {
            Logger.error(`getFileList() failed to get files - repo:${params.repoName}`);
            throw error;
        }
    }
}