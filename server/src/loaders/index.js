const expressLoader = require('./express');
const Logger = require('./logger');

module.exports = async (expressApp) => {
    await expressLoader(expressApp);
    Logger.info('Express loaded');
}