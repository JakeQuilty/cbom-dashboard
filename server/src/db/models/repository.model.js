const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../config');

module.exports = (sequelize) => {

    sequelize.define('Repository', {
        // get table names from config
        [config.dbTables.repository.repo_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.repository.repo_name]: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        [config.dbTables.repository.default_branch]: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        [config.dbTables.repository.org_id]: {
            type: DataTypes.INTEGER,
            references: config.dbTables.organization.name,
            referencesKey: config.dbTables.organization.org_id,
            allowNull: false
        }
    }, {
        tableName: config.dbTables.repository.name

    });
};