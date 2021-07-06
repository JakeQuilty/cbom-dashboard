const { DataTypes } = require('sequelize');
const config = require('../../config');

module.exports = (sequelize) => {
    sequelize.define('User', {
        // get table names from config
        [config.dbTables.user.user_id]: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        [config.dbTables.user.user_name]: {
            type: DataTypes.STRING(16),
            allowNull: false,
        },
        [config.dbTables.user.user_password]: {
            type: DataTypes.STRING(32),
            allowNull: false,
        },
        [config.dbTables.user.first_name]: {
            type: DataTypes.STRING(16),
        },
        [config.dbTables.user.last_name]: {
            type: DataTypes.STRING(16),
        },
        [config.dbTables.user.account_priv]: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        tableName: config.dbTables.user.name

    });
};