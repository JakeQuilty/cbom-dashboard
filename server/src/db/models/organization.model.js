const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../../config');

module.exports = (sequelize) => {

    sequelize.define('Organization', {
        // get table names from config
        [config.dbTables.organization.org_id]: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        [config.dbTables.organization.gh_id]: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        [config.dbTables.organization.org_name]: {
            type: DataTypes.STRING,
            allowNull: false
        },
        [config.dbTables.organization.auth_token]: {
            type: DataTypes.JSON,
            allowNull: false
        },
        [config.dbTables.organization.user_id]: {
            type: DataTypes.INTEGER,
            references: config.dbTables.user.name,
            referencesKey: config.dbTables.user.user_id
        },
        [config.dbTables.organization.avatar_url]: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: config.dbTables.organization.name

    });
};