const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../../config');

module.exports = (sequelize) => {

    sequelize.define('Dependency', {
        // get table names from config
        [config.dbTables.dependencyFile.dep_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.dependency.]: {
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

/*
dep_id INT(64) NOT NULL AUTO_INCREMENT,
dep_name VARCHAR(255) NOT NULL,
dep_version VARCHAR(16) NOT NULL,
scan_date DATE NOT NULL,
depfile_id INT(32) NOT NULL,
*/