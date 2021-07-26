const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../config');

module.exports = (sequelize) => {

    sequelize.define('FileType', {
        // get table names from config
        [config.dbTables.fileType.type_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.fileType.language_name]: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
        tableName: config.dbTables.fileType.name

    });
};