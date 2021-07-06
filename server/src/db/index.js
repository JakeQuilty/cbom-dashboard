const config = require('../config');
const { Sequelize } = require('sequelize');
const Logger = require('../loaders/logger');

const sequelize = new Sequelize(
    config.mysql.production.database,
    config.mysql.production.user,
    config.mysql.production.password, {
    host: config.mysql.production.address,
    dialect: config.mysql.production.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    logging: Logger.debug.bind(Logger),
    define: {
        timestamps: false,
    }
});

const modelDefiners = [
    require('./models/organization.model'),
    require('./models/user.model'),
]

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize;


