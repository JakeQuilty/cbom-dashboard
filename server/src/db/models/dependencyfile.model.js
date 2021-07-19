const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../config');

module.exports = (sequelize) => {

    sequelize.define('DependencyFile', {
        // get table names from config
        [config.dbTables.dependencyFile.depfile_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.dependencyFile.file_name]: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        [config.dbTables.dependencyFile.file_path]: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        [config.dbTables.dependencyFile.repo_id]: {
            type: DataTypes.INTEGER,
            references: config.dbTables.repository.name,
            referencesKey: config.dbTables.repository.repo_id,
            allowNull: false
        },
        [config.dbTables.dependencyFile.type_id]: {
            type: DataTypes.INTEGER,
            references: config.dbTables.fileType.name,
            referencesKey: config.dbTables.fileType.type_id,
            allowNull: false
        }
    }, {
        tableName: config.dbTables.dependencyFile.name

    });
};