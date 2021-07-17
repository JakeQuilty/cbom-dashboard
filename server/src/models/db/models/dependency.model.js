const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../../config');

module.exports = (sequelize) => {

    sequelize.define('Dependency', {
        // get table names from config
        [config.dbTables.dependency.dep_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.dependency.dep_name]: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        [config.dbTables.dependency.dep_version]: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        [config.dbTables.dependency.scan_date]: {
            type: DataTypes.DATE,
            allowNull: false
        },
        [config.dbTables.dependency.depfile_id]: {
            type: DataTypes.INTEGER,
            references: config.dbTables.dependencyFile.name,
            referencesKey: config.dbTables.dependencyFile.depfile_id,
            allowNull: false
        }
    }, {
        tableName: config.dbTables.dependency.name
    });
};