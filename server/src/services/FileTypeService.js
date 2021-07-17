const Logger = require('../loaders/logger');
const config = require('../config');
const { dbResultToObject } = require('../utils/db.util');

const dbRow = {
    language_name: config.dbTables.fileType.language_name,
    type_id: config.dbTables.fileType.type_id
}
    
module.exports = class FileTypeService {
    constructor (DatabaseModels) {
        this.models = DatabaseModels;
    }

    /**
     * Gets the database ID for the file_type of that language
     * @param {string} language 
     * @returns 
     */
     async getLanguageID(language) {
        try {
            const filetype = await this.models.FileType.findOne({
                where: {
                    [dbRow.language_name]: language
                }
            });
            if (filetype === null) return null;
            else return filetype[dbRow.type_id];
        } catch (error) {
            Logger.error("FileTypeService.getLanguageID() failed on query");
            throw error;
        }
    }

    /**
     * Gets all db languages and IDs from file_type
     * @returns object ex: { language: id_num, javascript: 3 }
     */
    async getAllLanguageID() {
        try {
            const result = await this.models.FileType.findAll({
                attributes: [dbRow.type_id, dbRow.language_name]
            });

            // convert the result to an easily readable table
            let languageTable = {}
            result.forEach( element => {
                languageTable[element[dbRow.language_name]] = element[dbRow.type_id];
            });

            return languageTable;
        } catch (error) {
            Logger.error("FileTypeService.getAllLanguageID() failed on query");
            throw error;
        }
    }
}