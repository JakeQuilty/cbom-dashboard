const Logger = require('../loaders/logger');
const config = require('../config');
const sequelize = require('../db')

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

    // WARNING: this puts a param in the raw SQL. Make sure this is never user input
    // lists all repos using a dep
    async listRepos(params) {
        const SQL = `SELECT r.* FROM repository r WHERE repo_id IN (SELECT repo_id FROM dependency_file WHERE depfile_id IN (SELECT depfile_id FROM dependency WHERE dep_name = "${params.depName}"));`
        const [results, metadata] = await sequelize.query(SQL);

        return results;
    }
}