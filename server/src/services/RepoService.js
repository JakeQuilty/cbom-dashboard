const config = require('../config');
const sequelize = require('../db');
const Logger = require('../loaders/logger');

const dbRow = {
    repo_id: config.dbTables.repository.repo_id,
    repo_name: config.dbTables.repository.repo_name,
    org_id: config.dbTables.repository.org_id,
    default_branch: config.dbTables.repository.default_branch,
    depfile_id: config.dbTables.dependencyFile.depfile_id,
    num_deps: config.dbTables.repository.num_deps
}

var languageIDTable = undefined;

module.exports = class RepoService {
    constructor (GitHubService, DatabaseModels, DepedencyFileService, FileTypeService) {
        this.ghService = GitHubService;
        this.models = DatabaseModels;
        this.dfService = DepedencyFileService;
        this.ftService = FileTypeService;
    }

    /**
     * Creates a repo in the database if it doesn't already exist
     * and updates the default branch if it is out of date
     * @param {Object} params orgID, repoName, defaultBranch
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

        Logger.debug(`Creating Repo: ${params.repoName}`);

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
     * @param {Object} params repoID, orgName, repoName, fileTree, authToken
     * @returns array of files that failed to scan
     */
    async scan(params) {

        let failedFiles = [];

        // this might be a little messy, but need a way to make sure this only gets called once
        if (languageIDTable === undefined) {
            languageIDTable = await this.ftService.getAllLanguageID()
        }

        Logger.debug(`Beginning file scans for Repo: ${params.repoName}`);
        for (const file of params.fileTree){
            try {
                if (!await this.dfService.isDepFile(file.type, file.path)){
                    continue;
                }
                // get file language and parser
                let { language, parser } = await this.dfService.getParser(file.path);
                let typeID = languageIDTable[language];

                Logger.silly(`Scanning Repo: ${params.repoName} File: ${file.path}, 
                    Language: ${language}, typeID: ${typeID}`);

                // create
                let depFileData = await this.dfService.create({
                    repoID: params.repoID,
                    typeID: typeID,
                    filePath: file.path,
                });

                // get blob
                const blob = await this.dfService.getBlob({
                    orgName: params.orgName,
                    repoName: params.repoName,
                    sha: file.sha,
                    authToken: params.authToken
                });

                // parse
                const dependencies = await parser(blob);
                if (dependencies === null) {
                    Logger.debug(`Repo:${params.repoName} File: ${file.path} does not have any dependencies`);
                    continue
                }

                //scan
                await this.dfService.scan(depFileData[dbRow.depfile_id], dependencies);

            } catch (error) {
                Logger.error(`RepoService.scan failed to scan file: ${file.path}`, error);
                failedFiles.push({file: file.path, error: error});
                continue;
            }
        }

        return failedFiles;
    }

    /**
     * Lists all repos in an org
     * @param {Object} params orgID
     * @returns an array of repos
     */
    async list(params) {
        const repos = await this.models.Repository.findAll({
            where: {
                [dbRow.org_id]: params.orgID
            }
        });

        return repos;

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

        Logger.silly(`Getting FileList for ${params.orgName}:${params.repoName}:${params.defaultBranch}`)
        const octokit = await this.ghService.getOctokit(params.authToken);
        try {
            // if truncated = true, we're missing files
            // https://docs.github.com/en/rest/reference/git#get-a-tree
            // const commitData = await octokit.request('GET /repos/{owner}/{repo}/commits/{default_branch}', {
            //     owner: params.orgName,
            //     repo: params.repoName,
            //     default_branch: params.defaultBranch
            //   });

            // const sha = commitData.data.sha;

            const result = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{default_branch}?recursive=true', {
                owner: params.orgName,
                repo: params.repoName,
                default_branch: params.defaultBranch
              });

            
            return result.data.tree;

        } catch (error) {
            Logger.error(`getFileList() failed to get files - repo:${params.repoName}`);
            throw error;
        }
    }

    // These functions directly use the sequelize import instead of models

    // should find a better way to do this without having to import sequelize.
    // WARNING: this puts a param in the raw SQL. Make sure this is never user input
    // repoID
    async countDeps(params) {
        const SQL = `SELECT * FROM dependency WHERE depfile_id IN (SELECT depfile_id FROM dependency_file WHERE repo_id=${params.repoID});`
        const [results, metadata] = await sequelize.query(SQL);

        const numDeps = results.length

        await this.models.Repository.update({[dbRow.num_deps]: numDeps}, {
            where: {
                [dbRow.repo_id]: params.repoID
            }
        });

        return numDeps;
    }

    // WARNING: this puts a param in the raw SQL. Make sure this is never user input
    // repoID
    async listDeps(params) {
        const SQL = `SELECT * FROM dependency WHERE depfile_id IN (SELECT depfile_id FROM dependency_file WHERE repo_id=${params.repoID});`
        const [results, metadata] = await sequelize.query(SQL);

        return results;
    }
}