const Logger = require('../loaders/logger');
const path = require('path');

const dbRow = {
    // repo_name: config.dbTables.repository.repo_name,
    // org_id: config.dbTables.repository.org_id,
    // default_branch: config.dbTables.repository.default_branch
}

const DEP_FILES = [
    //'Gemfile',
    //'Gemfile.lock',
    //'requirements.txt',
    'package.json',
    //'package-lock.json'
];

module.exports = class DependencyFileService {
    constructor (GitHubService, DatabaseModels, FileTypeService) {
        this.ghService = GitHubService;
        this.models = DatabaseModels;
        this.FileTypeService = this.FileTypeService;
    }
    
    async isDepFile(type, fullPath) {
        if (type !== 'blob') return false;

        let fileName = path.basename(fullPath)  
        return (DEP_FILES.includes(fileName));
    }

    async create() {

    }

    async getBlob() {
        
    }

    async parse(blob) {
        let parser = determineParser(this.path);

    }

    async scan() {

    }

    async determineLanguage(filePath) {
        let fileName = path.basename(filePath)
        switch (fileName) {
            case 'package.json':
                return {language: 'javascript', parser: require('./parsers/package-json.parser.js')};
            case 'requirements.txt':
                return {language: 'python', parser: 'NEED TO MAKE'};
        }
    }

    async getLanguageID() {
        // do this here instead of in filetypeservice
        // no need for another service that only has one method
    }

}

/*
backend_1   | {
backend_1   |   path: 'package.json',
backend_1   |   mode: '100644',
backend_1   |   type: 'blob',
backend_1   |   sha: 'efa06499f54f456d98a7568662d12ea7610fe112',
backend_1   |   size: 2146,
backend_1   |   url: 'https://api.github.com/repos/adobe/reactor-bridge/git/blobs/efa06499f54f456d98a7568662d12ea7610fe112'
backend_1   | }
*/