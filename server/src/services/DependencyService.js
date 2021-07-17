const Logger = require('../loaders/logger');
const config = require('../config');

const dbRow = {
    depfile_id: config.dbTables.dependencyFile.depfile_id,
    file_name: config.dbTables.dependencyFile.file_name,
    file_path: config.dbTables.dependencyFile.file_path,
    file_sha: config.dbTables.dependencyFile.file_sha,
    repo_id: config.dbTables.dependencyFile.repo_id,
    type_id: config.dbTables.dependencyFile.type_id
}

modules.exports = class DependencyService {
    constructor (DatabaseModels) {
        this.models = DatabaseModels;
    }
    async create(params) {
        await this.models.Dependency.create({

        });
    }
}