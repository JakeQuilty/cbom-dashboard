const Logger = require('../loaders/logger');
const path = require('path');
const config = require('../config');

const dbRow = {
    depfile_id: config.dbTables.dependencyFile.depfile_id,
    file_name: config.dbTables.dependencyFile.file_name,
    file_path: config.dbTables.dependencyFile.file_path,
    file_sha: config.dbTables.dependencyFile.file_sha,
    repo_id: config.dbTables.dependencyFile.repo_id,
    type_id: config.dbTables.dependencyFile.type_id
}

const DEP_FILES = [
    'package.json',
    //'package-lock.json',
    //'Gemfile',
    //'Gemfile.lock',
    //'requirements.txt',
];

module.exports = class DependencyFileService {
    constructor (GitHubService, DatabaseModels, DependencyService) {
        this.ghService = GitHubService;
        this.models = DatabaseModels;
        this.dpService = DependencyService;
    }
    
    async isDepFile(type, fullPath) {
        if (type !== 'blob') return false;

        let fileName = path.basename(fullPath)  
        return (DEP_FILES.includes(fileName));
    }

    /**
     * Creates a dependency file in the database
     * @param {Object} params repoID, filePath, typeID
     * @returns the db depfile object
     */
    async create(params) {
        try {
            //check params
            const schema = require('../utils/schema/schema.DependencyFileService.create');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("DependencyFileService.create() called with invalid parameters");
            throw error;
        }
        let fileName = path.basename(params.filePath);

        // create only if depfile doesn't already exist
        try {
            let depFile = await this.models.DependencyFile.findOrCreate({
                where: {
                    [dbRow.repo_id]: params.repoID,
                    [dbRow.file_path]: params.filePath
                },
                defaults: {
                    [dbRow.file_name]: fileName,
                    [dbRow.type_id]: params.typeID
                }
            });

            // return without the created value, because we don't need it
            return depFile[0];

        } catch (error) {
            Logger.error("DependencyFileService.create() failed");
            throw error;
        }

    }

    /**
     * Gets the file blob from GitHub and decodes it
     * @param {Object} params orgName, repoName, sha, authToken
     * @returns Plaintext file blob
     */
    async getBlob(params) {
        //check params
        try {
            const schema = require('../utils/schema/schema.DependencyFileService.getBlob');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("DependencyFileService.getBlob() called with invalid parameters");
            throw error;
        }

        Logger.silly(`Getting Blob for ${params.orgName}:${params.repoName}:${params.sha}`)
        const octokit = await this.ghService.getOctokit(params.authToken);
        try {
            const encodedBlob = await octokit.rest.git.getBlob({
                owner: params.orgName,
                repo: params.repoName,
                file_sha: params.sha
            });
            let buff = Buffer.from(encodedBlob.data.content, 'base64');
            return buff.toString();
        } catch (error) {
            Logger.error("DependencyFileService.getBlob failed", error);
            throw error;
        }

    }

    async scan(params) {

        for (const dep in params.dependencies) {
            this.dpService.create({

            });
        }

    }

    /**
     * Determines what language and parser to use for
     * a file path that leads to a dependency file
     * @param {string} filePath 
     * @returns {object} { language: string, parser: function() }
     */
    async getParser(filePath) {
        let fileName = path.basename(filePath)
        switch (fileName) {
            case 'package.json':
                const { parse } = require('./parsers/package-json.parser.js')
                return {language: 'javascript', parser: parse};
            // case 'requirements.txt':
            //     return {language: 'python', parser: 'NEED TO MAKE'};
        }
    }
}