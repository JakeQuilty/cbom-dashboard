const config = require('../config');
const { Sequelize } = require('sequelize');
const Logger = require('../loaders/logger');

const sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.user,
    config.mysql.password, {
    host: config.mysql.address,
    dialect: config.mysql.dialect,
    pool: {
        max: config.mysql.poolMax,
        min: config.mysql.poolMin,
        acquire: config.mysql.poolAcquire,
        idle: config.mysql.poolIdle
    },
    logging: Logger.silly.bind(Logger),
    define: {
        timestamps: false,
    }
});

const modelDefiners = [
    require('./models/organization.model'),
    require('./models/user.model'),
    require('./models/repository.model'),
]

for (const modelDefiner of modelDefiners) {
    modelDefiner(sequelize);
}

module.exports = sequelize;


