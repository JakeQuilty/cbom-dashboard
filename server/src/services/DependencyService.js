const Logger = require('../loaders/logger');
const config = require('../config');

const dbRow = {
    dep_id: config.dbTables.dependency.dep_id,
    dep_name: config.dbTables.dependency.dep_name,
    dep_version: config.dbTables.dependency.dep_version,
    scan_date: config.dbTables.dependency.scan_date,
    depfile_id: config.dbTables.dependency.depfile_id
}

module.exports = class DependencyService {
    constructor (DatabaseModels) {
        this.models = DatabaseModels;
    }

    /**
     * Creates a dependency entry in database
     * @param {Object} params depName, version, scanDate, depFileID
     * @returns db data of dependency
     */
    async create(params) {
        try {
            //check params
            const schema = require('../utils/schema/schema.DependencyService.create');
            await schema.validateAsync(params);

        } catch (error) {
            Logger.error("DependencyService.create() called with invalid parameters");
            throw error;
        }

        Logger.silly(`Creating db entry for dependency: ${params.depName}`);
        // create only if dep doesn't already exist
        try {
            let dep = await this.models.Dependency.findOrCreate({
                where: {
                    [dbRow.depfile_id]: params.depFileID,
                    [dbRow.dep_name]: params.depName
                },
                defaults: {
                    [dbRow.dep_version]: params.version,
                    [dbRow.scan_date]: params.scanDate
                }
            });

            // split dep data from if-created value
            let created = dep[1];
            dep = dep[0];

            // update version and scan date if it already existed
            if (!created) {
                 return await this.models.Dependency.update({
                    [dbRow.scan_date]: params.scanDate,
                    [dbRow.dep_version]: params.version
                }, {
                    where: {
                        [dbRow.depfile_id]: params.depFileID,
                        [dbRow.dep_name]: params.depName
                    }
                });
            }

            // this means anything not with same date after this scan will not exist anymore
            // comb through and delete those?

            return dep;

        } catch (error) {
            Logger.error("DependencyService.create() failed");
            throw error;
        }
    }
}
/*
    dep_id INT(64) NOT NULL AUTO_INCREMENT,
    dep_name VARCHAR(255) NOT NULL,
    dep_version VARCHAR(16) NOT NULL,
    scan_date DATE NOT NULL,
    depfile_id INT(32) NOT NULL,
*/