const config = require('../config');
const Logger = require('../loaders/logger');

const dbRow = {
    language_name: config.dbTables.fileType.language_name,
    type_id: config.dbTables.fileType.type_id
}

module.exports = class FileTypeService {
    constructor (DatabaseModels) {
        this.models = DatabaseModels;
    }

    async getLanguageID() {

    }

}